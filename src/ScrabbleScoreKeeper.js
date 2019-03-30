import React from 'react';
import PlayerPicker from './PlayerPicker.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';
import ScrabbleTile from './ScrabbleTile.js';
import Tooltip from './Tooltip.js';
import Game from './game.js';
import {scrabbleScore} from './Util.js';

const debug = true;
let old_game;

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleAddWord = this.handleAddWord.bind(this);
    this.handleEndTurn = this.handleEndTurn.bind(this);
    this.handleBingo = this.handleBingo.bind(this);

    this.state = {
      game: Game.createNewGame(this.props.playerNames.length),
      currentWord: {value: '', modifiers: [], score: 0},
      bingo: false
    }
  }

  handleChange(word) {
    word = {...word, score: scrabbleScore(word.value, word.modifiers)}
    this.setState({currentWord: word});
  }

  handleEndTurn() {
    if (this.state.currentWord.value.length !== 0) {
      this.setState({game: this.state.game.addWord(this.state.currentWord).endTurn()})
    } else {
      this.setState({game: this.state.game.endTurn()})
    }
    this.setState({currentWord: {value: '', modifiers: [], score: 0}})
  }

  handleUndo() {
    this.setState({currentWord: {value: '', modifiers: [], score: 0}, game: old_game});
  }

  handleAddWord() {
    if (this.state.currentWord.value.length !== 0) {
      this.setState({game: this.state.game.addWord(this.state.currentWord)})
    }
    this.setState({currentWord: {value: '', modifiers: [], score: 0}})
  }

  handleBingo() {
    this.setState({bingo: !this.state.bingo, game: this.state.game.setBingo(!this.state.bingo)});
  }

  render() {
    let currentWords = this.state.game.players[this.state.game.currentPlayerIndex][this.state.game.getCurrentTurnNumber() - 1]
    return (
      <div className='score-keeper'>
        <br />
        <ScoreGrid currentTurn={this.state.game.getCurrentTurnNumber() + 1} playerNames={this.props.playerNames} game={this.state.game} />
        <div>
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord}/>
          <CurrentScore words={currentWords} score={this.state.currentWord.score}/>
          <button onClick={this.handleUndo}type="submit" className="btn btn-info word-submit-button">UNDO</button>
          <button onClick={this.handleAddWord}type="submit" className="btn btn-info word-submit-button">+ ADD A WORD</button>
          <button onClick={this.handleEndTurn}type="submit" className="btn btn-info word-submit-button">END TURN</button>
          <button onClick={this.handleBingo}type="submit" className="btn btn-info word-submit-button">BINGO</button>     <br /><br />
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

  activePlayerClass(i, currentPlayerIndex) {
    return i === currentPlayerIndex ? 'player-header current' : 'player-header';
  }
  render() {
    return (
      <table className="table table-bordered" align="center">
          <thead>
            <tr className="thead-rows">
              <th id="move">Move</th>
              {this.props.playerNames.map((player, i) =>
              <th key={i} className={this.activePlayerClass(i, this.props.game.currentPlayerIndex)}>{player}</th>)}
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
    let result = [];
    let words = this.props.turn.words;
    for (let i = 0; i < words.length; i++) {
      let letterTiles = words[i].value.split('').map((letter, j) => {
        let tile = <ScrabbleTile key={j} letter={letter} modifier={words[i].modifiers[j]} />
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
X Take out class Turn and Game from this file
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
X Make ScrabbleInputBox a controlled componant (get rid of handleReset(), instead pass value=this.state.currentWord).
- Bingo is buggy (cannot have two players doing bingo in a row)
*/