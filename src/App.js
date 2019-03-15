import React from 'react';

const debug = true;

class Section1 extends React.Component {
  state = {
    numberOfPlayers: this.props.defaultNumberOfPlayers
  }

  handleChange(e) {
    this.setState({numberOfPlayers: parseInt(e.target.value)});
  }

  render() {
    return (
      <div className='section1'>
        <h3>Choose number of players:</h3>
        <div>
          <select value={this.state.numberOfPlayers} onChange={this.handleChange.bind(this)} className="custom-select">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select><br /><br />
          <div className="input-group-append">
              <button onClick={() => this.props.onNext(this.state.numberOfPlayers)} type="submit" className="btn btn-info">Next</button>
          </div><br /><br />
        </div>
      </div>
    );
  }
}

class Section2 extends React.Component {
  state = {
    playerNames: this.props.defaultNames,
    numberOfPlayers: this.props.defaultNumberOfPlayers
  }

  get playerNames() {
    return this.state.playerNames;
  }

  handleChange(i, e) {
    let names = this.state.playerNames.slice();
    names[i] = e.target.value;
    this.setState({playerNames: names});
  }

  render() {
    return (
      <div className='section2'>
        <div className="main-text">
          <h3>Choose nicknames for players:</h3>
          <div className="input_names">
            {this.state.playerNames.map((name, i) => 
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

class Section3 extends React.Component {
  state = {
    currentPlayerIndex: 0,
    currentMove: 1,
    players: [
      {name: "Anna", wordHistory: [{word:'word', score: 8}, {word: 'leaf', score: 9}]},
      {name: "Nico", wordHistory: [{word:'rose', score: 6}]}
    ]
  }

  render() {
    return (
      <div className='section3'>
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
          <div>
            <br />
            <p className="bold">Submit a word:</p>
            <div id='input-container'>
              <div className='real-input-box'>
                <div id='blink-me'></div>
                  <input id='input-word' type='text' name='word'  size='15' maxLength='30' autoComplete='off'  /><br />
                <div className='scrabble-tiles'></div>
              </div>
            </div>
            <button type="submit" className="btn btn-info word-submit-button">Submit</button>     <br /><br />
          </div>
        <div className="row justify-content-center">
        </div>
        <br />
        <table id='score-table' className="table table-bordered" align="center">
          <thead>
            <tr className="thead-rows">
              <th id="move">Move</th>
              {this.props.playerNames.map((name, i) =>
              <th key={i} className="player-header">{name}</th>)}
            </tr>
          </thead>
          <tbody className="tbody-rows">
          {[...Array(this.state.currentMove + 1)].map((_, i) =>
            <tr key={i}>
              <th>{i+1}</th>
              {this.state.players.map((player, j) =>
                <td key={j}>{player.wordHistory[i] ? <TableCellContent word={player.wordHistory[i]}/> : null}</td> )}
            </tr> )}
          </tbody>
        </table>
      </div>
    )
  }
}

class TableCellContent extends React.Component {
render() {
  return (
    <span>{this.props.word.word}<div class='score-box'>{this.props.word.score}</div></span>
    )
  }
}

class App extends React.Component {
  state = debug ? {
    currentSection: 3,
    numberOfPlayers: 2,
    playerNames: ["Anna", "Nico"]
  } :
  {
    currentSection: 1,
    numberOfPlayers: 2,
    playerNames: []
  }

  handleSection1Next(numberOfPlayers) {
    this.setState({currentSection: 2, numberOfPlayers: numberOfPlayers});
  }

  handleSection2Back(target) {
    this.setState({currentSection: 1, playerNames: target.playerNames});
  }

  handleSection2Next(target) {
    this.setState({currentSection: 3, playerNames: target.playerNames});
  }

  getDefaultPlayerNames() {
    let namesArray = this.state.playerNames.slice(0, this.state.numberOfPlayers);
    while (namesArray.length < this.state.numberOfPlayers)
      namesArray.push('');
    return namesArray;
  }

  render() {
    return (   
      <div className="main-text">
        <h1> Scrabble score keeper</h1>
        <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        {this.state.currentSection === 1 ?
          <Section1 onNext={this.handleSection1Next.bind(this)} defaultNumberOfPlayers={this.state.numberOfPlayers} /> :
         this.state.currentSection === 2 ?
          <Section2 onBack={this.handleSection2Back.bind(this)} onNext={this.handleSection2Next.bind(this)}
                    defaultNames={this.getDefaultPlayerNames()}/> :
          this.state.currentSection === 3 ?
          <Section3 playerNames={this.state.playerNames}/> : null
        }
      </div>
    );
  }
}

export default App;
