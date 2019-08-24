import React from 'react';
import WordInTiles from './WordInTiles';

class ScoreGridCell extends React.Component {
  renderPassed() {
    const { game, move } = this.props;
    return (
       <tr>
        <td>
          { game.isMoveInGameOver(move) ? 'NO LEFTOVERS' : 'PASS' }
        </td>
      </tr> 
    )
  }

  renderNormal() {
    const { turn, language } = this.props;
    const rows = turn.words.map((word, i) => (

      <tr key={`row-word-${i}`} className="word-row">
        <td className="word-cell"><WordInTiles word={word} language={language} /></td>
        {i === 0
          ? (
            <td rowSpan={`${turn.bingo ? turn.words.length + 1 : turn.words.length}`} className="score-cell">
              <span className="score-box">
                {turn.score}
              </span>
            </td>
          )
          : null}
      </tr>
    ));

    if (turn.bingo) {
      rows.push(
        <tr key="bingo">
          <td colSpan="2">BINGO!</td>
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
