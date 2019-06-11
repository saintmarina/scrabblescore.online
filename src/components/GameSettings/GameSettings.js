import React from 'react';
import { resizeArray } from '../../logic/util';
import './GameSettings.css';

class GameSettings extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeOfName = this.handleChangeOfName.bind(this);
    this.handleChangeOfLanguage = this.handleChangeOfLanguage.bind(this);
    this.handleGameStart = this.handleGameStart.bind(this);

    this.state = {
      numberOfPlayers: 4,
      playerNames: ['', ''],
      language: 'en',
    };
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
        <nav className="navbar navbar-expand-md navbar-light">
            <ul className="navbar-nav ml-auto">
                 <select className="custom-select" id="language-select" value={language} onChange={this.handleChangeOfLanguage} >
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="fr">French</option>
                  </select>
            </ul>
        </nav>
        <div className='LoGo'></div>
        <p className="description">
          Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
          Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in
          an innovative and easy way, whilst playing the Scrabble board game.
        </p>
        <form>
          <div className="player-names-choice">
            {[...Array(numberOfPlayers)].map((_, i) => (
              <input
                onChange={e => this.handleChangeOfName(i, e)}
                id={`player-name-input-${i}`}
                key={i}
                type="text"
                className={playerNames[i] && playerNames[i].length > 0 ? "form-control player-name filled" : "form-control player-name"}
                placeholder={`Player ${i + 1}`}
              />
            ))}
          </div>
          <div className="input-group">
            <button onClick={this.handleGameStart} type="submit" className="btn next">Next</button>
          </div>
        </form>
      </div>
    );
  }
}


export default GameSettings;