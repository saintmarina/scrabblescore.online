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
      language: 'English'
    }
  }
  handleChangeOfNumber(e) {
    this.setState({numberOfPlayers: parseInt(e.target.value)});
  }

  handleChangeOfName(i, e) {
    let names = this.state.playerNames.slice();
    names[i] = e.target.value;
    this.setState({playerNames: names});
  }

  handleChangeOfLanguage(e) {
    this.setState({language: e.target.value});
  }

  getDefaultPlayerNames() {
    return resizeArray(this.state.playerNames, this.state.numberOfPlayers, '');
  }

  /*handleNumberPickerDone(target) {
    this.setState({numberOfPlayers: target.numberOfPlayers});
  }

  handleNamePickerBack(target) {
    this.setState({currentSection: 1, playerNames: target.playerNames});
  }
  */

  setGameSettings(target) {
    this.setState({playerNames: target.state.playerNames});
    this.props.setGame(target.state.playerNames, this.state.language);
  }

  render() {
    return (
      <div>
      <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
       <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        <h3>Choose language:</h3>
        <div>
          <select value={this.state.language} onChange={this.handleChangeOfLanguage} className="custom-select">
            <option value="English">English</option>
            <option value="Russian">Russian</option>
            <option value="French">French</option>
          </select><br /><br />
          </div>
        <h3>Choose number of players:</h3>
        <div>
          <select value={this.state.numberOfPlayers} onChange={this.handleChangeOfNumber} className="custom-select">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select><br /><br />
          <h3>Choose nicknames for players:</h3>
          <div className="input_names">
            {this.getDefaultPlayerNames().map((name, i) => 
              <input onChange={e => this.handleChangeOfName(i, e)}
                key={i} type="text" className="form-control player-name"
                placeholder={`Player ${i+1}`} value={name} /> )}
          </div><br />
          <div className='input-group'>
              <button onClick={() => this.setGameSettings(this)} type="submit" className="btn btn-info">Next</button>
              <br /><br />
          </div>
      </div>
      </div>
    )
  }
}

/* class NumberPicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      numberOfPlayers: this.props.defaultNumberOfPlayers
    }
  }
  get numberOfPlayers() {
    return this.state.numberOfPlayers;
  }

  handleChange(e) {
    this.setState({numberOfPlayers: parseInt(e.target.value)});
  }

  render() {
    return (
      <div className='NumberPicker'>
      <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
       <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        <h3>Choose number of players:</h3>
        <div>
          <select value={this.numberOfPlayers} onChange={this.handleChange} className="custom-select">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select><br /><br />
          <div className="input-group-append">
              <button onClick={() => this.props.onDone(this)} type="submit" className="btn btn-info">Next</button>
          </div><br /><br />
        </div>
      </div>
    );
  }
}

class NamePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      playerNames: this.props.defaultNames,
    }
  }
  get playerNames() {
    return this.state.playerNames;
  }

  handleChange(i, e) {
    let names = this.playerNames.slice();
    names[i] = e.target.value;
    this.setState({playerNames: names});
  }

  render() {
    return (
      <div className='NamePicker'>
          <h3>Choose nicknames for players:</h3>
          <div className="input_names">
            {[...Array(this.props.numberOfPlayers)].map((_, i) => 
              <input onChange={e => this.handleChange(i, e)}
                key={i} type="text" className="form-control player-name"
                placeholder={`Player ${i+1}`} value={name} /> )}
          </div><br />
          <div className='input-group'>
              <button onClick={() => this.props.onBack(this)} type="submit" className="btn btn-info">Back</button>
              <button onClick={() => this.props.onNext(this)} type="submit" className="btn btn-info">Next</button>
              <br /><br />
          </div>
      </div>
    );
  }
}*/

export default GameSettings;
