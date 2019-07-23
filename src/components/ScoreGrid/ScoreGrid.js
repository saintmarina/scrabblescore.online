import React from 'react';
import ScoreGridCell from './ScoreGridCell';
import './ScoreGrid.css';

class ScoreGrid extends React.Component {
  activeTurnClass(turn, currentTurn) {
    return turn === currentTurn ? 'player-turn active' : 'player-turn';
  }

  render() {
    const { playerNames, game, language } = this.props;
    return (
      <table className="table table-bordered" align="center">
        <thead>
          <tr className="thead-rows">
            <th className="move-header" >Move</th>
            {playerNames.map((player, i) => (
              <th
                key={i}
                className="player-header"
              >
                {player}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody-rows">
          {[...Array(game.getCurrentTurnNumber() + 1)].map((_, i) => (
            <tr className="turn-row" key={i}>
              <th className="move-number">{i + 1}</th>
              {game.playersTurns.map((player, j) => (
                <td key={j} className={this.activeTurnClass(player[i], game.getCurrentTurn())}>
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
