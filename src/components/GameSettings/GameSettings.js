import React from 'react';
import { resizeArray } from '../../logic/util';
import './GameSettings.css';

class GameSettings extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeOfNumber = this.handleChangeOfNumber.bind(this);
    this.handleChangeOfName = this.handleChangeOfName.bind(this);
    this.handleChangeOfLanguage = this.handleChangeOfLanguage.bind(this);
    this.handleGameStart = this.handleGameStart.bind(this);

    this.state = {
      numberOfPlayers: 2,
      playerNames: ['', ''],
      language: 'en',
    };
  }

  handleChangeOfNumber(e) {
    let { playerNames } = this.state;
    const numberOfPlayers = parseInt(e.target.value, 10);
    playerNames = resizeArray(playerNames, numberOfPlayers, '');
    this.setState({ numberOfPlayers, playerNames });
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
    const { playerNames, language } = this.state;
    const { onGameStart } = this.props;
    e.preventDefault(); /* prevent form submission */
    onGameStart(playerNames.map((name, i) => (name || `Player ${i + 1}`)), language);
  }

  render() {
    const { language, numberOfPlayers, playerNames } = this.state;
    return (
      <div>
        <img src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width="750" height="200" />
        <p>
          Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
          Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in
          an innovative and easy way, whilst playing the Scrabble board game.
        </p>
        <form>
          <div className="language-choice">
            <h6>Choose language:</h6>
            <select id="language-select" value={language} onChange={this.handleChangeOfLanguage} className="custom-select">
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="number-of-players-choice">
            <h6>Choose number of players:</h6>
            <select id="number-of-players-select" value={numberOfPlayers} onChange={this.handleChangeOfNumber} className="custom-select">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="player-names-choice">
            <h6>Choose nicknames for players:</h6>
            {playerNames.map((name, i) => (
              <input
                onChange={e => this.handleChangeOfName(i, e)}
                id={`player-name-input-${i}`}
                key={i}
                type="text"
                className="form-control player-name"
                placeholder={`Player ${i + 1}`}
              />
            ))}
          </div>
          <div className="input-group">
            <button onClick={this.handleGameStart} type="submit" className="btn btn-info next">Next</button>
          </div>
        </form>
      </div>
    );
  }
}


export default GameSettings;