import React from 'react';
import ScoreGridCell from './ScoreGridCell';
import './ScoreGrid.css';

class ScoreGrid extends React.Component {
  activePlayerClass(i, currentPlayerIndex) {
    return i === currentPlayerIndex ? 'player-header current' : 'player-header';
  }

  render() {
    const { playerNames, game, language } = this.props;
    return (
      <table className="table table-bordered" align="center">
        <thead>
          <tr className="thead-rows">
            <th className="move-cell">Move</th>
            {playerNames.map((player, i) => (
              <th
                key={i}
                className={this.activePlayerClass(i, game.currentPlayerIndex)}
              >
                {player}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody-rows">
          {[...Array(game.getCurrentTurnNumber() + 1)].map((_, i) => (
            <tr className="move-row" key={i}>
              <th className="move">{i + 1}</th>
              {game.players.map((player, j) => (
                <td key={j}>
                  {player[i] ? <ScoreGridCell turn={player[i]} language={language} game={game} />
                    : null}
                </td>
              ))}
            </tr>
          ))}
          <tr className="total-score">
            <th className="move">TOTAL</th>
            {playerNames.map((_, i) => <td key={i}>{game.getTotalScore(i)}</td>)}
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ScoreGrid;
