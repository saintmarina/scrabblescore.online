import React from 'react';
import PlayerPicker from './PlayerPicker.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';
import ScrabbleTile from './ScrabbleTile.js';
import {resizeArray} from './Util.js';
import Tooltip from './Tooltip.js';

const debug = true;
let old_game;

class Game {
  constructor(wordHistories, currentPlayerIndex) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.wordHistories = wordHistories;
  }

  static createNewGame(numberOfPlayers) {
    let wordHistories = resizeArray([], numberOfPlayers, []);
    return new Game(wordHistories, 0)
  }

  play(wordObject) {
    let newWordHistories = this.wordHistories.map((history, playerIndex) => playerIndex === this.currentPlayerIndex ? [...history, wordObject] : history);
    let newPlayerIndex = (this.currentPlayerIndex + 1) % this.wordHistories.length;
    return new Game(newWordHistories, newPlayerIndex);
  }

  getPlayerHistory() {
    return this.wordHistories[this.currentPlayerIndex]
  };

  getCurrentTurn() {
    return this.wordHistories[this.wordHistories.length - 1].length + 1;
  };

  getTotalScore(playerIndex) {
    let result = 0;
    for ( let i = 0; i < (this.wordHistories[playerIndex].length); i++) {
      result += this.wordHistories[playerIndex][i].score
    }
    return result  };
}

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.scrabbleInputBoxComponent = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      currentWord: {value: '', modifiers: [], score: 0},
      game: Game.createNewGame(this.props.playerNames.length)
    }
  }

  handleChange(word) {
    this.setState({currentWord: word});
  }

  handleSubmit() {
    old_game = this.state.game;
    this.setState({currentWord: {value: '', modifiers: [], score: 0}, game: this.state.game.play(this.state.currentWord)});
    this.scrabbleInputBoxComponent.current.handleReset();
  }

  handleUndo() {
    this.setState({currentWord: {value: '', modifiers: [], score: 0}, game: old_game});
    this.scrabbleInputBoxComponent.current.handleReset();
  }

  render() {
    return (
      <div className='score-keeper'>
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
        <div>
          <br />
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox ref={this.scrabbleInputBoxComponent} onChange={this.handleChange} />
          <CurrentScore score={this.state.currentWord.score} />
          <button onClick={this.handleUndo.bind(this)}type="submit" className="btn btn-info word-submit-button">UNDO</button>
          <button onClick={this.handleSubmit.bind(this)}type="submit" className="btn btn-info word-submit-button">SUBMIT</button>     <br /><br />
        </div>
        <div className="row justify-content-center">
        </div>
        <br />
        <ScoreGrid currentTurn={this.state.game.getCurrentTurn()} playerNames={this.props.playerNames} game={this.state.game} />
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
              {this.props.game.wordHistories.map((wordHistory, j) =>
                <td key={j}>{wordHistory[i] ? <ScoreGridCell word={wordHistory[i]}/> : null}</td> )}
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
  render() {
    return (
      <span>{(this.props.word.value).split('').map((letter, i) =>
        this.props.word.modifiers[i] ?
        <Tooltip placement="top" trigger="hover" tooltip={this.props.word.modifiers[i]}>
          <ScrabbleTile letter={letter} modifier={this.props.word.modifiers[i]} table={' tableTile'}/>
        </Tooltip> :
         <ScrabbleTile letter={letter} modifier={this.props.word.modifiers[i]} table={' tableTile'}/>
        )}
      <div className='score-box'>{this.props.word.score}</div></span>
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