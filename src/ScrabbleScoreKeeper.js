import React from 'react';
import PlayerPicker from './PlayerPicker.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';
import ScrabbleTile from './ScrabbleTile.js';
import {resizeArray} from './Util.js';
import Tooltip from './Tooltip.js';

const debug = true;
//let gameTurnHistory = [];
let old_game;

class Turn {
  constructor(words, bingo) {
    this.words = words;
    this.bingo = bingo
  }

  /*get score() {
    let result = 0;
    for (let i = 0; i < this.words.length; i++) {
      result += this.words[i].score
      }

    if (this.bingo) {
      result += 50;
    }
  }*/
}

class Game {
  constructor(players, currentPlayerIndex) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.players = players;
  }

  static createNewGame(numberOfPlayers) {
    let turn = new Turn([], false)
    let players = resizeArray([[turn]], numberOfPlayers, []);
    return new Game(players, 0);
  }

  addWord(word) {
    let currentTurn = this.getCurrentTurn();
    console.log('currentTurn', currentTurn)
    let turn = currentTurn.words !== [] ? new Turn([...currentTurn.words, word], currentTurn.bingo) : new Turn(word, currentTurn.bingo)
    let currentPlayerCopy = this.getCurrentPlayer().slice();
    currentPlayerCopy[this.getCurrentTurnNumber() - 1] = turn;
 
 
    let newPlayers = this.players.map((player, playerIndex) => playerIndex === this.currentPlayerIndex ? currentPlayerCopy : player);
console.log('newPlayers', newPlayers)
    return new Game (newPlayers, this.currentPlayerIndex)
  }

  endTurn(word) {

    let newTurn = new Turn([], false)
    let newPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    let players = this.players.map((history, playerIndex) => playerIndex === newPlayerIndex ? [...history, newTurn] : history);
    return new Game(players, newPlayerIndex);
  }
  getCurrentTurn() {
    return this.getCurrentPlayer().slice(-1)[0];
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getCurrentTurnNumber() {
    // ((max this.players.length) -1 )
    return this.players[this.players.length - 1].length + 1;  
  }

  getTotalScore(playerIndex) {
    let result = 0;
    for ( let i = 0; i < (this.players[playerIndex].length); i++) {
      for (let j = 0; j <(this.players[playerIndex][i].length); j++) {
        result += this.players[playerIndex][i][j].score
    }}
    return result  };
}

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.scrabbleInputBoxComponent = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      currentWord: {value: '', modifiers: [], score: 0},
      game: Game.createNewGame(this.props.playerNames.length),
      bingo: false
    }
  }

  handleChange(word) {
    this.setState({currentWord: word});
  }

  handleEndTurn() {
    this.setState({game: this.state.game.addWord(this.state.currentWord).endTurn()});
    this.scrabbleInputBoxComponent.current.handleReset();
    
  }

  handleUndo() {
    this.setState({currentWord: {value: '', modifiers: [], score: 0}, game: old_game});
    this.scrabbleInputBoxComponent.current.handleReset();
  }

  handleAddWord() {
    this.setState({game: this.state.game.addWord(this.state.currentWord)});
    this.scrabbleInputBoxComponent.current.handleReset();
  }

  handleBingo() {
    this.setState({bingo:true});
  }

  displayAddedWords() {
    let result = [];
    if (this.state.currentWordsArray) {
      for (let i=0; i < this.state.currentWordsArray.length; i++) {
        result.push(<span key={i+10}>{this.state.currentWordsArray[i].value}<br /></span>)
        //result.push(<br />)
      }
    }
      return result
  }

  render() {
    let currentWords = this.state.game.players[this.state.game.currentPlayerIndex][this.state.game.getCurrentTurnNumber() - 1]
    return (
      <div className='score-keeper'>
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
        <div>
          <br />
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox ref={this.scrabbleInputBoxComponent} onChange={this.handleChange} />
          <h1>{this.displayAddedWords()}</h1>
        <CurrentScore words={currentWords} score={this.state.currentWord.score}/>
          <button onClick={this.handleUndo.bind(this)}type="submit" className="btn btn-info word-submit-button">UNDO</button>
          <button onClick={this.handleAddWord.bind(this)}type="submit" className="btn btn-info word-submit-button">+ ADD A WORD</button>
          <button onClick={this.handleEndTurn.bind(this)}type="submit" className="btn btn-info word-submit-button">END TURN</button>
          <button onClick={this.handleBingo.bind(this)}type="submit" className="btn btn-info word-submit-button">BINGO</button>     <br /><br />
        </div>
        <div className="row justify-content-center">
        </div>
        <br />
        <ScoreGrid currentTurn={this.state.game.getCurrentTurnNumber()} playerNames={this.props.playerNames} game={this.state.game} />
      </div>
    )
  }
}

class CurrentScore extends React.Component {
  countScore() {
    let result = this.props.score;
    if (this.props.words) {
    for (let i = 0; i < this.props.words.length; i++) {
      result += this.props.words[i].score
    }}
    return result
  }
  render() {
    return(
      <div id="score" className="card-header ">
        Score is {this.countScore()}
        </div>
    )
  }
}



class ScoreGrid extends React.Component {

  chooseClass(i, currentPlayerIndex) {
    return i === currentPlayerIndex ? 'player-header current' : 'player-header';
  }
  render() {
    return (
      <table id='score-table' className="table table-bordered" align="center">
          <thead>
            <tr className="thead-rows">
              <th id="move">Move</th>
              {this.props.playerNames.map((player, i) =>
              <th key={i} className={this.chooseClass(i, this.props.game.currentPlayerIndex)}>{player}</th>)}
            </tr>
          </thead>
          <tbody className="tbody-rows">
          {[...Array(this.props.currentTurn)].map((_, i) =>
            <tr key={i}>
              <th>{i+1}</th>
              {this.props.game.players.map((player, j) =>
                <td key={j}>{player[i] ? <ScoreGridCell turn={player[i]}/> : null}</td> )}
            </tr> )}
            <tr className='total-score'>
              <td></td>
              {this.props.playerNames.map((_, i) =>
                <td key={i}> {this.props.game.getTotalScore(i)}</td>)}
            </tr>
          </tbody>
        </table>
    )
  }
}

class ScoreGridCell extends React.Component {
  renderWords() {
    let result = [];
    let words = this.props.turn.words;
    for (let i = 0; i < words.length; i++) {
      let letterTiles = words[i].value.split('').map((letter, j) =>
      words[i].modifiers[j] ?
      <Tooltip key={i} placement="top" trigger="hover" tooltip={words[i].modifiers[j]}>
        <ScrabbleTile key={i} letter={letter} modifier={words[i].modifiers[j]} table={' tableTile'}/>
      </Tooltip> :
       <ScrabbleTile key={j+1100} letter={letter} modifier={words[i].modifiers[j]} table={' tableTile'} />)
      result.push(letterTiles)
      result.push(<span key={i}><span className='score-box'>{words[i].score}</span><br /></span>)
     // result.push(<br />)
    }
    return result
  }

  render() {
    return (
      <span>{this.renderWords()}</span>
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
0) X Fix warnings
1) X Have ScrabbleTile display its modifier underneath through a prop with  a css class to color the tile accordingly
2) X Make Game immutable. Take away the playerNames from Game. put the game variable directly in the ScoreKeeper's state.
   X To make Game immutable make sure to copy all arrays that you would modify.
   X

   X The ScoreGrid compoenent should take a game as a prop.
3) X Highlight the current player
4) X Add totals to the ScoreGrid
5) X Show the words in the ScoreGrid as ScrableTiles. Put the ScrableTile component in its own file.
6) X Implement undo of the submit button. This should not be done in the game class, but rather in the ScoreKeeper class.
    in the submit button handler, save the current game in this.state.old_game. Undo would restore the old game to the current game. 
7) - Think about how to add multiple words for a move

Future Work:
- read game rules, and make sure to cover them all
- 

*/