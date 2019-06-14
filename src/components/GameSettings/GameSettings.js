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
    return (
      <div className="game-settings">
        <select className="custom-select" id="language-select" value={language} onChange={this.handleChangeOfLanguage} >
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="fr">French</option>
        </select> 
        <div className='LoGo'></div>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan sit amet ipsum eu vehicula.
          Integer ac purus eu tellus pretium tempus. Vestibulum viverra augue at sem feugiat, eget cursus orci fermentum.
          Morbi a quam ac neque tempus facilisis id vitae felis. Nam pulvinar eu dui at pharetra.
          Nullam suscipit justo quis odio iaculis, in consectetur libero hendrerit.
          Mauris bibendum, lacus quis consectetur dapibus, urna turpis dictum augue, nec luctus mauris ex quis magna.
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
            <button onClick={this.handleGameStart} type="submit" className="btn next"><span>Next</span></button>
          </div>
        </form>
      </div>
    );
  }
}


export default GameSettings;