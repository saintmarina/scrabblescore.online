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

  getTotalScore(playerIndex) {
    let result = 0;
    for (let i = 0; i < (this.Players[playerIndex].wordHistory.length); i++) {
      result += this.Players[playerIndex].wordHistory[i].score
    };
    return result;
  };
}

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.game = new Game(this.props.playerNames);
    this.handleChange = this.handleChange.bind(this);
    console.log(props);
    this.state = {
      currentWord: {value: '', modifiers: [], score: 0},
      ...this.getGameState()
    }
  }

  handleChange(word) {
    this.setState({currentWord: word});
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
      <div className='score-keeper'>
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
      <div id="score" className="card-header ">
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

class ScrabbleScoreKeeper extends React.Component {
  state = debug ? {
    playerNames: ['Anna', 'Nico']
  } :
  {
    playerNames: []
  }

  handleGameStart(playerNames) {
    this.setState({playerNames: playerNames});
  }
  renderGame() {
    return this.state.playerNames.length === 0 ? 
      <PlayerPicker onPlayersChosen={this.handleGameStart.bind(this)} /> :
      <ScoreKeeper playerNames={this.state.playerNames} />;
  }

  render() {
    return (
      <div className='main'>
        <h1> Scrabble score keeper</h1>
        <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        {this.renderGame()}
      </div>
    );
  }
}

export default ScrabbleScoreKeeper;

/*
1) Have ScrabbleTile display its modifier underneath through a prop.
  * have a css class to color the tile accordingly


*/