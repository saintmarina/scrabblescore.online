import React from 'react';
import PlayerPicker from './PlayerPicker.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';
import ScrabbleTile from './ScrabbleTile.js';
import {resizeArray} from './Util.js';
import Tooltip from './Tooltip.js';

const debug = true;
let old_game;

class Turn {
  constructor(words, bingo) {
    this.words = words;
    this.bingo = bingo
  }

  static empty() {
    return new Turn([], false);
  }

  get score() {
    let result = 0;
    for (let i = 0; i < this.words.length; i++) {
      result += this.words[i].score
      }

    if (this.bingo) {
      result += 50;
    }
    return result
  }
}

class Game {
  constructor(players, currentPlayerIndex) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.players = players;
  }

  static createNewGame(numberOfPlayers) {
    let turn = Turn.empty()
    let players = resizeArray([[turn]], numberOfPlayers, []);
    return new Game(players, 0);
  }

  addWord(word) {
    let currentTurn = this._getCurrentTurn()
    let turn = new Turn([...currentTurn.words, word], currentTurn.bingo)
    return this._setTurn(turn)
  }

  endTurn(word) {
    let newPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    let players = this.players.map((history, playerIndex) => playerIndex === newPlayerIndex ? [...history, Turn.empty()] : history)
    return new Game(players, newPlayerIndex);
  }

  setBingo(value) {
    let turn = new Turn(this._getCurrentTurn().words, value)
    return this._setTurn(turn)
  }

  _setTurn(turn) {
    let currentPlayerCopy = this._getCurrentPlayer().slice();
    currentPlayerCopy[this.getCurrentTurnNumber()] = turn;
    let newPlayers = this.players.map((player, playerIndex) => playerIndex === this.currentPlayerIndex ? currentPlayerCopy : player);
    return new Game (newPlayers, this.currentPlayerIndex)
  }

  _getCurrentTurn() {
    return this._getCurrentPlayer().slice(-1)[0];
  }

  _getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getCurrentTurnNumber() {
    return this.players[0].length - 1
  }

  getCurrentPlayerIndex() {
    return this.currentPlayerIndex;
  }
  
  getTotalScore(playerIndex) {
    let currentPlayer = this.players[playerIndex]
    let result = 0
    for (let i = 0; i < (currentPlayer.length); i++) {
        result += currentPlayer[i].score
    }
    return result
  };
}

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.scrabbleInputBoxComponent = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      game: Game.createNewGame(this.props.playerNames.length),
      currentWord: {value: '', modifiers: [], score: 0},
      bingo: false
    }
  }

  handleChange(word) {
    this.setState({currentWord: word});
  }

  handleEndTurn() {
    /* TODO do not use tertinary operator. use if/else */
    this.state.currentWord.value.length !== 0 ? this.setState({game: this.state.game.addWord(this.state.currentWord).endTurn()}) :
    this.setState({game: this.state.game.endTurn()});
    this.scrabbleInputBoxComponent.current.handleReset();
  }

  handleUndo() {
    this.setState({currentWord: {value: '', modifiers: [], score: 0}, game: old_game});
    this.scrabbleInputBoxComponent.current.handleReset();
  }

  handleAddWord() {
    /* TODO this is overly complicated */
    this.state.currentWord.value.length !== 0 ? this.setState({game: this.state.game.addWord(this.state.currentWord)}):
    this.setState({game: this.state.game});
    this.scrabbleInputBoxComponent.current.handleReset();
  }

  handleBingo() {
    this.setState({bingo: !this.state.bingo, game: this.state.game.setBingo(!this.state.bingo)});
  }

  render() {
    let currentWords = this.state.game.players[this.state.game.currentPlayerIndex][this.state.game.getCurrentTurnNumber() - 1]
    /* TODO callbacks bind(this) should be done in the constructor */
    return (
      <div className='score-keeper'>
        <br />
        <ScoreGrid currentTurn={this.state.game.getCurrentTurnNumber() + 1} playerNames={this.props.playerNames} game={this.state.game} />
        <div>
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox ref={this.scrabbleInputBoxComponent} onChange={this.handleChange}/>
          <CurrentScore words={currentWords} score={this.state.currentWord.score}/>
          <button onClick={this.handleUndo.bind(this)}type="submit" className="btn btn-info word-submit-button">UNDO</button>
          <button onClick={this.handleAddWord.bind(this)}type="submit" className="btn btn-info word-submit-button">+ ADD A WORD</button>
          <button onClick={this.handleEndTurn.bind(this)}type="submit" className="btn btn-info word-submit-button">END TURN</button>
          <button onClick={this.handleBingo.bind(this)}type="submit" className="btn btn-info word-submit-button">BINGO</button>     <br /><br />
        </div>
        <div className="row justify-content-center">
        </div>
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

  /* TODO rename this function name to something better */
  chooseClass(i, currentPlayerIndex) {
    return i === currentPlayerIndex ? 'player-header current' : 'player-header';
  }
  render() {
    /* TODO dont use id=''. Use score-table as a className */
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
              <td>TOTAL</td>
              {this.props.playerNames.map((_, i) =>
                <td key={i}>{this.props.game.getTotalScore(i)}</td>)}
            </tr>
          </tbody>
        </table>
    )
  }
}

/* TODO make a component that takes a word as a prop, and renders the tiled word with tooltips for modifiers */

class ScoreGridCell extends React.Component {
  renderWords() {
    /* TODO The score grid cell should be a table with two column. Left column with the words, and right column with the score */
    /* TODO take out table="..." from the props. You can use a simple css rule that scopes the rules with its parent */
    let result = [];
    let words = this.props.turn.words;
    for (let i = 0; i < words.length; i++) {
      let letterTiles = words[i].value.split('').map((letter, j) => {
        let tile = <ScrabbleTile key={j} letter={letter} modifier={words[i].modifiers[j]} table=" tableTile"/>
        if (words[i].modifiers[j])
          tile = <Tooltip key={j} placement="top" trigger="hover" tooltip={words[i].modifiers[j]}>{tile}</Tooltip>
        return tile
      })
      result.push(letterTiles)
      result.push(<span key={i}><span className='score-box'>{words[i].score}</span><br /></span>)
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
    return !debug ? 
      <PlayerPicker onPlayersChosen={this.handleGameStart.bind(this)} /> :
      <ScoreKeeper playerNames={this.state.playerNames} />;
  }

  render() {
    return (
      <div className='main'>
        <h1> Scrabble score keeper</h1>
        {this.renderGame()}
      </div>
    );
  }
}

export default ScrabbleScoreKeeper;

/*
TODO
- find TODO's by doing "git grep TODO" in your terminal
- Take out class Turn and Game from this file
- write tests for util's resizeArray() and scrableScore()
- ScoreGrid should not take a currentTurn as prop. But use the game props for its needs.
- Implement unlimited undos.
- lowercase the inbox box
- The bingo button should be toggleable
- The add a word button should be disabled if no word is typed
- The Undo button should be disabled if it's not possible to undo
- CurrentScore should only take score as a prop.
- When a player has passed, show "Passed" in the grid with (0) score.
- If a player has bingo, show "Bingo" with (50) in the score.
- Make ScrabbleInputBox a controlled componant (get rid of handleReset(), instead pass value=this.state.currentWord).
- Bingo is buggy (cannot have two players doing bingo in a row)
*/