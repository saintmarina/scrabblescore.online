import React from 'react';
import PlayerPicker from './PlayerPicker.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';

const debug = false;

class Game {
  constructor(playerNames) {
    this.currentPlayerIndex = 0;
    this.Players = playerNames.map(name => {
      return {name: name, wordHistory: []};
    });
  }

  play(word) {
    this.Players[this.currentPlayerIndex].wordHistory.push(word);
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.Players.length;
  };

  getPlayerHistory(playerIndex) {
    return this.Players[playerIndex].wordHistory
  };

  getPlayerName(playerIndex) {
    return this.Players[playerIndex].name
  };

  getCurrentTurn() {
    return this.Players[this.Players.length - 1].wordHistory.length + 1;  
  };

  /*
  getTotalScore(playerIndex) {
    let result = 0;
    for (let i = 0; i < (this.Players[playerIndex].wordHistory.length); i++) {
      result += this.Players[playerIndex].wordHistory[i].score
    };
    return result;
  };
  */
}

class Section3 extends React.Component {
  constructor(props) {
    super(props);
    this.game = new Game(this.props.playerNames);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      currentWord: {value: '', modifiers: [], score: 0},
      ...this.getGameState()
    }
  }

  handleChange(wordObject) {
    this.setState({currentWord: wordObject});
  }

  getGameState() {
    return {players: this.game.Players,
            currentPlayerIndex: this.game.currentPlayerIndex,
            currentTurn: this.game.getCurrentTurn(),
            }
  }

  refreshGameState() {
    this.setState(this.getGameState());
  }

  render() {
    return (
      <div className='section3'>
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
        <div>
          <br />
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox onChange={this.handleChange} />
          <CurrentScore score={this.state.currentWord.score} />
          <button type="submit" className="btn btn-info word-submit-button">Submit</button>     <br /><br />
        </div>
        <div className="row justify-content-center">
        </div>
        <br />
        <ScoreGrid currentTurn={this.state.currentTurn} players={this.state.players} />
      </div>
    )
  }
}

class CurrentScore extends React.Component {
  render() {
    return(
      <div id="score" class="card-header ">
        Score is {this.props.score}
        </div>
    )
  }
}



class ScoreGrid extends React.Component {
  render() {
    return (
      <table id='score-table' className="table table-bordered" align="center">
          <thead>
            <tr className="thead-rows">
              <th id="move">Move</th>
              {this.props.players.map((player, i) =>
              <th key={i} className="player-header">{player.name}</th>)}
            </tr>
          </thead>
          <tbody className="tbody-rows">
          {[...Array(this.props.currentTurn)].map((_, i) =>
            <tr key={i}>
              <th>{i+1}</th>
              {this.props.players.map((player, j) =>
                <td key={j}>{player.wordHistory[i] ? <ScoreGridCell word={player.wordHistory[i]}/> : null}</td> )}
            </tr> )}
          </tbody>
        </table>
    )
  }
}

class ScoreGridCell extends React.Component {
  render() {
    return (
      <span>{this.props.word.word}<div className='score-box'>{this.props.word.score}</div></span>
    )
  }
}

class App extends React.Component {
  state = debug ? {
    currentSection: 3,
    playerNames: ['Anna', 'Nico']
  } :
  {
    currentSection: 1,
    playerNames: []
  }

  handleSectionChange(sectionNumber) {
    this.setState({currentSection: sectionNumber});
  }

  handlePlayerChange(playerNames) {
    this.setState({playerNames: playerNames});
  }
  section() {
    let section = (this.state.currentSection === 1 || this.state.currentSection ===  2) ? 
      <PlayerPicker currentSection={this.state.currentSection} onSectionChange = {this.handleSectionChange.bind(this)}
                    onPlayerChange={this.handlePlayerChange.bind(this)} /> :
      <Section3 playerNames={this.state.playerNames} />;
      return section
  }

  render() {
    return (
      <div className='main'>
        <h1> Scrabble score keeper</h1>
        <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        {this.section()}
      </div>
    );
  }
}

export default App;

/*
1) Make a new component "PlayerPicker"
    - The parent (App) should not know about the different sections. All it wants is a callback onPlayerSelected, which
    get called at the end of the player picking process (the section2 next), with the player array

2) Have ScrabbleTile display its modifier underneath through a prop.
  * have a css class to color the tile accordingly
3) rename wordObject into word
4) rename Section3 into something more appropriate
*/