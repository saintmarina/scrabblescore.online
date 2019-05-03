import React from 'react';
import {resizeArray} from './Util.js';

class GameSettings extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeOfNumber = this.handleChangeOfNumber.bind(this);
    this.handleChangeOfName = this.handleChangeOfName.bind(this);
    this.handleChangeOfLanguage = this.handleChangeOfLanguage.bind(this);
    this.state = {
      numberOfPlayers: 2,
      playerNames: [],
      language: 'en'
    }
  }
  handleChangeOfNumber(e) {
    this.setState({numberOfPlayers: parseInt(e.target.value)});
  }

  handleChangeOfName(i, e) {
    let names = this.state.playerNames.slice();
    names[i] = e.target.value;
    for (let j = 0; j < names.length; j++) {
      if (!names[j]) names[j] = ''
    }
    this.setState({playerNames: names});
  }

  handleChangeOfLanguage(e) {
    this.setState({language: e.target.value});
  }

  getDefaultPlayerNames() {
    return resizeArray(this.state.playerNames, this.state.numberOfPlayers, '');
  }

  setGameSettings() {
    console.log(this.getDefaultPlayerNames())
    this.props.onGameStart(this.getDefaultPlayerNames().map((name, i) => name ? name : `Player ${i+1}`), this.state.language);
  }

  render() {
    /* DONE Fix indentation */
    return (
      <div>
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
        <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
           Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
           innovative and easy way, whilst playing the Scrabble board game.</p>
        <h3>Choose language:</h3>
        <div>
          <select id='language-select' value={this.state.language} onChange={this.handleChangeOfLanguage} className="custom-select">
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="fr">French</option>
          </select>
        </div>
        <h3>Choose number of players:</h3>
        <div>
          <select id='number-of-players-select' value={this.state.numberOfPlayers} onChange={this.handleChangeOfNumber} className="custom-select">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <h3>Choose nicknames for players:</h3>
        <div>
          {this.getDefaultPlayerNames().map((name, i) => 
            <input onChange={e => this.handleChangeOfName(i, e)} id={'player-name-input-' + i}
                   key={i} type="text" className="form-control player-name"
                   placeholder={`Player ${i+1}`} value={name} /> )}
        </div>
        <div className='input-group'>
          <button onClick={() => this.setGameSettings(this)} type="submit" className="btn btn-info">Next</button>
        </div>
      </div>
    )
  }
}


export default GameSettings;
