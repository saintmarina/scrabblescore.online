import React from 'react';
import './GameSettings.css';
import { isStaticBuild } from '../../logic/util';
import HomePage from './HomePage';


class GameSettings extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeOfName = this.handleChangeOfName.bind(this);
    /*this.handleChangeOfLanguage = this.handleChangeOfLanguage.bind(this);*/
    this.handleGameStart = this.handleGameStart.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      numberOfPlayers: 4,
      playerNames: ['', ''],
      language: 'en',
      isTagDisabled: true,
    };
  }

  componentDidMount() {
    this.setState({isTagDisabled: isStaticBuild()});
  }

  handleChangeOfName(i, e) {
    let { playerNames } = this.state;
    playerNames = playerNames.slice();
    playerNames[i] = e.target.value;
    this.setState({ playerNames });
  }
/*
  handleChangeOfLanguage(e) {
    this.setState({ language: e.target.value });
  }
  */

  handleGameStart(e) {
    const { playerNames, language } = this.state;
    const { onGameStart } = this.props;
    e.preventDefault(); /* prevent form submission */
    onGameStart(playerNames.map((name, i) => (name || `Player ${i + 1}`)), language);
  }

  handleKeyDown(e) {
    if (e.key === 'Enter')
      this.handleGameStart(e);
  }

  render() {
    const { numberOfPlayers, playerNames, isTagDisabled } = this.state;
    return (
      <HomePage>
        <form>
          <div className="player-names-choice-container">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {[...Array(numberOfPlayers)].map((_, i) => (
                    <input
                      onChange={e => this.handleChangeOfName(i, e)}
                      onKeyDown={this.handleKeyDown} 
                      id={`player-name-input-${i}`}
                      key={i}
                      type="text"
                      className={playerNames[i] && playerNames[i].length > 0 ? 'form-control player-name filled' : 'form-control player-name'}
                      placeholder={`Player ${i + 1}`}
                      disabled={isTagDisabled}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="start-btn-container">
            <button className="btn start" type="button" onClick={this.handleGameStart} disabled={isTagDisabled}>START</button>
          </div>
        </form>
      </HomePage>
    );
  }
}


export default GameSettings;
