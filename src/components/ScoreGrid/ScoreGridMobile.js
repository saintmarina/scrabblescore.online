import React from 'react';
import ScoreGridCell from './ScoreGridCell';
import './ScoreGrid.css';

class ScoreGridMobile extends React.Component {
  render() {
    const { playerNames, game, language } = this.props;
    return (
      <table className="table table-bordered" align="center">
        <thead>
          <tr className="thead-rows">
            <th className="playerNames">Players</th>
            <th className="playerTurn">Player Turn</th>
           </tr>
        </thead>
        <tbody className="tbody-rows">
          {game._getCurrentPlayer().map((_, i) => (
            game.players.map((player, j) => (
              player[i]
                  ? <tr key={i}>
                      <td>
                        {playerNames[j]}
                      </td>
                      <td>
                        <ScoreGridCell turn={player[i]} language={language} game={game} />
                      </td>
                    </tr>
                  : null
              ))
            ))
          }
        </tbody>
      </table>
    )
  }
}
export default ScoreGridMobile;