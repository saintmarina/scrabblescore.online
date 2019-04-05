import React from 'react';
import ScrabbleTile from './ScrabbleTile.js';
import Tooltip from './Tooltip.js';

export default class ScoreGrid extends React.Component {
  activePlayerClass(i, currentPlayerIndex) {
    return i === currentPlayerIndex ? 'player-header current' : 'player-header';
  }

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
              <tr key={i}>
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
    let letterTiles = this.props.word.value.split('').map((letter, i) => {
      /* TODO Do not duplicate the scrableTile code */
      /* TODO fix indentation */
          if (this.props.word.modifiers[i]) {
            return <Tooltip key={i} placement="top" trigger="hover" tooltip={this.props.word.modifiers[i]}>
              <ScrabbleTile key={i} letter={letter} modifier={this.props.word.modifiers[i]} language={this.props.language}/>
            </Tooltip>
          } else {
            return <ScrabbleTile key={i} letter={letter} modifier={this.props.word.modifiers[i]} language={this.props.language}/>
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
    /* TODO remove key */
    return(
      <tr key={0}>
        <td>
        {"PASS".split('').reverse().map((letter,i) =>
          <span key={i} className='score-box'>{letter}</span>)}
        </td>
      </tr>
  )}

  renderNormal() {
    /* TODO 50 should be a const up there */
    /* TODO fix indentation of the inside map function */
    let cell = []; /* TODO You don't need a cell variable */
    /* TODO rename row -> rows */
    let row = this.props.turn.words.map((word, i) =>
              <tr key={i}>
                <td><WordInTiles word={word} language={this.props.language}/></td>
                <td><span className={word.score >= 50 ? 'score-box high':'score-box' }>{word.score}</span></td>
              </tr>)
    cell.push(row)
    if (this.props.turn.bingo) {
      /* TODO fix identation */
        cell.push(<tr key='bingo'><td>BINGO</td><td><span className='score-box high'>50</span></td></tr>)
      }
    return cell
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