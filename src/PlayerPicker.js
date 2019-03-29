import React from 'react';
import {resizeArray} from './Util.js';

class PlayerPicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleNumberPickerNext = this.handleNumberPickerNext.bind(this);
    this.handleNamePickerBack = this.handleNamePickerBack.bind(this);
    this.handleNamePickerNext = this.handleNamePickerNext.bind(this);
    this.state = {
      currentSection: 1,
      numberOfPlayers: 2,
      playerNames: []
    }
  }

  handleNumberPickerNext(target) {
    this.setState({currentSection: 2, numberOfPlayers: target.state.numberOfPlayers});
  }

  handleNamePickerBack(target) {
    this.setState({currentSection: 1, playerNames: target.state.playerNames});
  }

  handleNamePickerNext(target) {
    this.setState({playerNames: target.state.playerNames});
    this.props.onPlayersChosen(target.state.playerNames);
  }

  getDefaultPlayerNames() {
    return resizeArray(this.state.playerNames, this.state.numberOfPlayers, '');
  }

  render() {
    return (
      <div>
        {this.state.currentSection === 1 ? 
          <NumberPicker onNext={this.handleNumberPickerNext} defaultNumberOfPlayers={this.state.numberOfPlayers} /> : 
          <NamePicker onBack={this.handleNamePickerBack} onNext={this.handleNamePickerNext}
                      defaultNames={this.getDefaultPlayerNames()} />}
      </div>
    )
  }
}

class NumberPicker extends React.Component {
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
              <button onClick={() => this.props.onNext(this)} type="submit" className="btn btn-info">Next</button>
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
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
        <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        <div className="main-text">
          <h3>Choose nicknames for players:</h3>
          <div className="input_names">
            {this.playerNames.map((name, i) => 
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
      </div>
    );
  }
}

export default PlayerPicker;
