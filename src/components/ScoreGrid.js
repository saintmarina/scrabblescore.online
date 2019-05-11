import React from 'react';
import ScrabbleTile from './ScrabbleTile';
import Tooltip from './Tooltip';
import {scrabbleScore} from '../logic/util';
import './ScoreGrid.css';

const highScore = 50;
const bingoScore = 50;

export default class ScoreGrid extends React.Component {
  activePlayerClass(i, currentPlayerIndex) {
    return i === currentPlayerIndex ? 'player-header current' : 'player-header';
  }

  render() {
    const { playerNames, game, language } = this.props;
    return (
      <table className="table table-bordered" align="center">
        <thead>
          <tr className="thead-rows">
            <th className='move'>Move</th>
              {playerNames.map((player, i) =>
              <th key={i} className={this.activePlayerClass(i, game.currentPlayerIndex)}>{player}</th>)}
          </tr>
        </thead>
        <tbody className="tbody-rows">
          {[...Array(game.getCurrentTurnNumber() + 1)].map((_, i) => 
            <tr className="move-row" key={i}>
              <th>{i+1}</th>
                {game.players.map((player, j) =>
                  <td key={j}>{player[i] ? <ScoreGridCell turn={player[i]} language={language} game={game} /> :
                  null}</td>)}
            </tr> )}
            <tr className='total-score'>
              <th>TOTAL</th>
                {playerNames.map((_, i) =>
                  <td key={i}>{game.getTotalScore(i)}</td>)}
            </tr>
        </tbody>
      </table>
    )
  }
}

class WordInTiles extends React.Component {
  render() {
    const { word, language } = this.props;
    let letterTiles = word.value.split('').map((letter, i) => {
      let tile = <ScrabbleTile 
                    key={i}
                    letter={letter}
                    modifier={word.modifiers[i]}
                    score={scrabbleScore(letter, [null], language)}
                  /> 
      /* DONE take out else. Use the pattern of modifying the variable like the adding word in endTurn() */
      if (word.modifiers[i]) {
        tile = <Tooltip 
                  key={i}
                  placement="top"
                  trigger="hover"
                  tooltip={word.modifiers[i]}
                >
                  {tile}
                </Tooltip>
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
    const { turn, language } = this.props;
    let rows = turn.words.map((word, i) =>
                <tr key={i}>
                  <td><WordInTiles word={word} language={language} /></td>
                  <td><span className={word.score >= highScore ? 'score-box high':'score-box' }>{word.score}</span></td>
                </tr>)
    if (turn.bingo) {
      rows.push(<tr key='bingo'>
                  <td>BINGO</td>
                  <td>
                    <span className='score-box high'>{bingoScore}</span>
                  </td>
                </tr>
                )
    }
    return rows
  }

  render() {
    const { turn, game } = this.props;
    return (
      <table className='cell-table'>
        <tbody>
          {turn.isPassed(game) ? this.renderPassed() : this.renderNormal()}
        </tbody>
      </table>
    )
  }
}