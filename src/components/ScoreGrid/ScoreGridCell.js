import React from 'react';
import WordInTiles from './WordInTiles';

const highScore = 50;

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
        {i === 0
          ? <td rowSpan={`${turn.bingo ? turn.words.length + 1 : turn.words.length}`} className="score-cell">
              <span className={turn.score >= highScore ? 'score-box high' : 'score-box'}>
                {turn.score}
              </span>
            </td>
          : null}
      </tr>
    ));

    if (turn.bingo) {
      rows.push(
        <tr key="bingo" className="row bingo-row">
          <td className="bingo-cell"><span className="bingo">BINGO!</span></td>
        </tr>
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
