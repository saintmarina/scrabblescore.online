import React from 'react';
import './GameSettings.css';
import { resizeArray, isStaticBuild, setStartTime } from '../../logic/util';
import { persistState, getPersistedState } from '../../logic/util';
import HomePage from './HomePage';


const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;

class GameSettings extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeOfName = this.handleChangeOfName.bind(this);
    this.handleChangeOfLanguage = this.handleChangeOfLanguage.bind(this);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.state = {
      playerNames: resizeArray([], MAX_PLAYERS, ""),
      language: 'en',
      isTagDisabled: true,
    };
  }

  componentDidMount() {
    let { playerNames } = getPersistedState("settings") || this.state;
    playerNames = resizeArray(playerNames, MAX_PLAYERS, "");
    this.setState({playerNames, isTagDisabled: isStaticBuild()});
  }

  handleChangeOfName(i, e) {
    let { playerNames } = this.state;
    playerNames = playerNames.slice();
    playerNames[i] = e.target.value;
    this.setState({ playerNames });
  }

  handleChangeOfLanguage(e) {
    this.setState({ language: e.target.value });
  }

  handleGameStart(e) {
    let { playerNames, language } = this.state;
    const { onGameStart } = this.props;
    e.preventDefault(); /* prevent form submission */

    /* we discard any empty player names at the end */
    const trimRightArray = (arr) => {
      return arr
        .reverse()
        .reduce((acc, value) => value || acc.length > 0 ? [...acc, value] : acc, [])
        .reverse();
    }

    playerNames = playerNames.map(s => s.trim());
    playerNames = trimRightArray(playerNames);

    persistState("settings", {playerNames});

    if (playerNames.length < MIN_PLAYERS)
      playerNames = resizeArray(playerNames, MIN_PLAYERS, "");

    onGameStart(playerNames.map((name, i) => (name || `Player ${i + 1}`)), language);
    setStartTime(); // Recording start time of the game
  }

  render() {
    const { playerNames, isTagDisabled, language } = this.state;
    return (
      <HomePage language={language} handleLangChange={this.handleChangeOfLanguage}>
        <form onSubmit={this.handleGameStart}>
          <div className="player-names-choice-container">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {playerNames.map((playerName, i) => (
                    <input
                      key={i}
                      onChange={e => this.handleChangeOfName(i, e)}
                      value={playerName}
                      className="form-control player-name"
                      placeholder={`Player ${i + 1}`}
                      disabled={isTagDisabled}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="start-btn-container">
            <button className="btn start" type="submit" disabled={isTagDisabled}>START</button>
          </div>
        </form>
      </HomePage>
    );
  }
}


export default GameSettings;
