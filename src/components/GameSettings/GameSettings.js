import React from 'react';
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
    const { isMobile } = this.props;
    return (

      <div className="container">
        <div className="row">
          <div className="col-sm-2 offset-sm-10">
            <select className="custom-select" id="language-select" value={language} onChange={this.handleChangeOfLanguage}>
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="logo">
            {isMobile
              ? <img src="mobile_logo.png" alt="logo" width="300"/> 
              : <img src="big_logo.png" alt="logo" width="520"/>
            }
            </div>
            <span className="description">
              <p>
                 Hello and welcome to Scrabble Score Online. This is an easy-to-use tool
                 that replaces pen-and-paper for keeping track of Scrabble scores.
              </p>
              <p>
                 Simply fill in the players’ names in order that they will
                 take turns and press the “START” button.
              </p>
              <p>Relax and enjoy your game, now you don’t need to do any math!</p>
            </span>
          </div>
        </div>
        <form>
          <div className="player-names-choice-container">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {[...Array(numberOfPlayers)].map((_, i) => (
                    <input
                      onChange={e => this.handleChangeOfName(i, e)}
                      id={`player-name-input-${i}`}
                      key={i}
                      type="text"
                      className={playerNames[i] && playerNames[i].length > 0 ? 'form-control player-name filled' : 'form-control player-name'}
                      placeholder={`Player ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="start-btn-container">
            <button className="btn start" type="button" onClick={this.handleGameStart}>START</button>
          </div>
        </form>
      </div>
    );
  }
}


export default GameSettings;
