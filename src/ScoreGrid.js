import React from 'react';
import ScrabbleTile from './ScrabbleTile.js';
import Tooltip from './Tooltip.js';
import {scrabbleScore} from './Util.js';

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
                <td key={j}>{player[i] ? <ScoreGridCell turn={player[i]} language={this.props.language}/> : null}</td>)}
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
    /* DONE Do not duplicate the scrableTile code */
    /* DONE fix indentation */
    let letterTiles = this.props.word.value.split('').map((letter, i) => {
      let tile = <ScrabbleTile key={i} letter={letter} modifier={this.props.word.modifiers[i]} score={scrabbleScore(letter, [null], this.props.language)}/> 
      if (this.props.word.modifiers[i]) {
        return <Tooltip key={i} placement="top" trigger="hover" tooltip={this.props.word.modifiers[i]}>{tile}</Tooltip>
      } else {
        return tile
      }})
    return (
      <div>
        {letterTiles}
      </div>
    )
  }
}

class ScoreGridCell extends React.Component {
  renderPassed() {
    /* DONE remove key */
    return(
      <tr>
        <td>
        {"PASS".split('').map((letter,i) =>
          <span key={i} className='score-box'>{letter}</span>)}
        </td>
      </tr>
  )}

  renderNormal() {
    /* DONE 50 should be a const up there */
    /* DONE fix indentation of the inside map function */
    let highScore = 50; /* DONE You don't need a cell variable */
    /* DONE rename row -> rows */
    let rows = this.props.turn.words.map((word, i) =>
                <tr key={i}>
                  <td><WordInTiles word={word} language={this.props.language}/></td>
                  <td><span className={word.score >= highScore ? 'score-box high':'score-box' }>{word.score}</span></td>
                </tr>)
    if (this.props.turn.bingo) {
    /* DONE fix identation */
      rows.push(<tr key='bingo'><td>BINGO</td><td><span className='score-box high'>50</span></td></tr>)
    }
    return rows
  }

  render() {
    /* DONE refactor like: this.props.turn.passed ? renderNormal() : renderPassed() */
    return (
      <table className='cell-table'>
        <tbody>
        {this.props.turn.passed ? this.renderPassed() : this.renderNormal()}
        </tbody>
      </table>
    )
  }
}