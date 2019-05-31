import React from 'react';
import WordInTiles from './WordInTiles';

const highScore = 50;
const bingoScore = 50;

class ScoreGridCell extends React.Component {
  renderPassed() {
    return (
      <tr>
        <td>
          {'PASS'.split('').map((letter, i) => <span key={i} className="score-box">{letter}</span>)}
        </td>
      </tr>
    );
  }

  renderNormal() {
    const { turn, language } = this.props;
    const rows = turn.words.map((word, i) => (
      <tr key={`row-word-${i}`} className="word-row">
        <td className="word-cell"><WordInTiles word={word} language={language} /></td>
        <td className="score-cell"><span className={word.score >= highScore ? 'score-box high' : 'score-box'}>{word.score}</span></td>
      </tr>
    ));
    if (turn.bingo) {
      rows.push(
        <tr key="bingo">
          <td>BINGO</td>
          <td>
            <span className="score-box high">{bingoScore}</span>
          </td>
        </tr>,
      );
    }
    return rows;
  }

  render() {
    const { turn, game } = this.props;
    return (
      <table className="score-grid-cell">
        <tbody>
          {turn.isPassed(game) ? this.renderPassed() : this.renderNormal()}
        </tbody>
      </table>
    );
  }
}

export default ScoreGridCell;
