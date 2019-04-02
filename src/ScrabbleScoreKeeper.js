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
    this.setState({game: this.state.game.setBingo(!this.state.game._getCurrentTurn().bingo)});
  }

  setButtonState() {
    if (this.state.currentWord.value === '') {
      return true
      } else {
      return false
    }
  }

  render() {
    return (
      <div className='score-keeper'>
        <br />
        <ScoreGrid playerNames={this.props.playerNames} game={this.state.game} />
        <div>
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord}/>
          <CurrentScore score={this.state.currentWord.score}/>
          <button onClick={this.handleUndo}type="submit" className="btn btn-info word-submit-button">UNDO</button>
          <button onClick={this.handleAddWord}type="submit" className="btn btn-info word-submit-button" disabled={this.setButtonState()}>+ ADD A WORD</button>
          <button onClick={this.handleEndTurn}type="submit" className="btn btn-info word-submit-button">END TURN</button>
          <div className="custom-control custom-switch">
            <input onChange={this.handleBingo} type="checkbox" className="custom-control-input" id="customSwitch1" checked={this.state.game._getCurrentTurn().bingo}/>
            <label className="custom-control-label" htmlFor="customSwitch1">BINGO</label>
          </div>     <br /><br />
        </div>
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
            {[...Array(this.props.game.getCurrentTurnNumber() + 1)].map((_, i) =>
              <tr key={i}>
                <th>{i+1}</th>
                {this.props.game.players.map((player, j) =>
                  <td key={j}>{player[i] ? <ScoreGridCell turn={player[i]} /> : null}</td>)}
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

class WordInTiles extends React.Component {
  render() {
    let letterTiles = this.props.word.value.split('').map((letter, i) => {
          if (this.props.word.modifiers[i]) {
            return <Tooltip key={i} placement="top" trigger="hover" tooltip={this.props.word.modifiers[i]}>
              <ScrabbleTile key={i} letter={letter} modifier={this.props.word.modifiers[i]} />
            </Tooltip>
          } else {
            return <ScrabbleTile key={i} letter={letter} modifier={this.props.word.modifiers[i]} />
          }})
    return (
      <div>
        {letterTiles}
      </div>
    )
  }
}


class ScoreGridCell extends React.Component {
  displayPass() {
    let cell = [];
    if (this.props.turn.words[0] !== 'PASS') {
      let row = this.props.turn.words.map((word, i) => 
                <tr key={i}>
                <th><WordInTiles word={word}/></th>
                <th><span className='score-box'>{word.score}</span></th>
              </tr>)
      let bingo = this.props.turn.bingo ? <tr><th>BINGO</th><th><span className='score-box'>50</span></th></tr> : null
      cell.push(row)
      cell.push(bingo)

    } else {
      let row = <tr>
              <th>
              {this.props.turn.words[0].split('').reverse().map(letter => 
                <span className='score-box'>{letter}</span>)}
              </th>
            </tr>
      cell.push(row)
    }
    return cell
  }

  render() {
    return (
      <table className='cell-table'>
        <tbody>
        {this.displayPass()}
        </tbody>
      </table>
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
X find TODO's by doing "git grep TODO" in your terminal
X Take out class Turn and Game from this file
X write tests for util's resizeArray() and scrableScore()
x ScoreGrid should not take a currentTurn as prop. But use the game props for its needs.
- Implement unlimited undos.
- The Undo button should be disabled if it's not possible to undo
X lowercase the inbox box
X The bingo button should be toggleable
X The add a word button should be disabled if no word is typed
X CurrentScore should only take score as a prop.
X When a player has passed, show "Passed" in the grid with (0) score.
X If a player has bingo, show "Bingo" with (50) in the score.
X Make ScrabbleInputBox a controlled componant (get rid of handleReset(), instead pass value=this.state.currentWord).
X Bingo is buggy (cannot have two players doing bingo in a row)
*/