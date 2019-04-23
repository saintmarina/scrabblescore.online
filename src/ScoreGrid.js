import React from 'react';
import ScrabbleTile from './ScrabbleTile.js';
import Tooltip from './Tooltip.js';
import {scrabbleScore} from './Util.js';

const highScore = 50;
const bingoScore = 50;

export default class ScoreGrid extends React.Component {
  activePlayerClass(i, currentPlayerIndex) {
    return i === currentPlayerIndex ? 'player-header current' : 'player-header';
  }

/* DONE fix indentation */
  render() {
    return (
      <table className="table table-bordered" align="center">
        <thead>
          <tr className="thead-rows">
            <th className='move'>Move</th>
            {this.props.playerNames.map((player, i) =>
            <th key={i} className={this.activePlayerClass(i, this.props.game.currentPlayerIndex)}>{player}</th>)}
          </tr>
        </thead>
        <tbody className="tbody-rows">
          {[...Array(this.props.game.getCurrentTurnNumber() + 1)].map((_, i) => 
            <tr className="move-row" key={i}>
              <th>{i+1}</th>
              {this.props.game.players.map((player, j) =>
                <td key={j}>{player[i] ? <ScoreGridCell turn={player[i]} language={this.props.language} game={this.props.game} /> : null}</td>)}
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
      let tile = <ScrabbleTile key={i} letter={letter} modifier={this.props.word.modifiers[i]} score={scrabbleScore(letter, [null], this.props.language)} /> 
      /* DONE take out else. Use the pattern of modifying the variable like the adding word in endTurn() */
      if (this.props.word.modifiers[i]) {
        tile =  <Tooltip key={i} placement="top" trigger="hover" tooltip={this.props.word.modifiers[i]}>{tile}</Tooltip>
      }
      return tile
    })
    /* DONE return statement on a single line */
    return <div>{letterTiles}</div>
  }
}

class ScoreGridCell extends React.Component {
  renderPassed() {
    /* DONE fix indentation */
    return(
      <tr>
        <td>
          {"PASS".split('').map((letter,i) =>
            <span key={i} className='score-box'>{letter}</span>)}
        </td>
      </tr>
  )}

  renderNormal() {
    /* DONE let -> const. Put the const in the top of the file */
    /* DONE have the BINGO score to be a const somehwere */
    
    let rows = this.props.turn.words.map((word, i) =>
                <tr key={i}>
                  <td><WordInTiles word={word} language={this.props.language} /></td>
                  <td><span className={word.score >= highScore ? 'score-box high':'score-box' }>{word.score}</span></td>
                </tr>)
    if (this.props.turn.bingo) {
      rows.push(<tr key='bingo'><td>BINGO</td><td><span className='score-box high'>{bingoScore}</span></td></tr>)
    }
    return rows
  }

  render() {
    /* DONE identation */
    return (
      <table className='cell-table'>
        <tbody>
          {this.props.turn.isPassed(this.props.game) ? this.renderPassed() : this.renderNormal()}
        </tbody>
      </table>
    )
  }
}