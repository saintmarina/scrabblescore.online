import React from 'react';

class TotalGridMobile extends React.Component {
  render() {
    const { playerNames, game } = this.props;
    return (
      <table className="table table-bordered" align="center">
        <thead>
          <tr class="names">
            {playerNames.map((player, i) => (
              <td key={`name-of-player-${i}`}>
                {player}
              </td>
              ))
            }
          </tr>
        </thead>
        <tbody>
          <tr className="playerTotals">
            {playerNames.map((player, i) => (
              <td key={`name-of-player-${i}`}>
                {game.getTotalScore(i)}
              </td>
              ))
            }
          </tr>
        </tbody>
      </table>
    )
  }
}
export default TotalGridMobile;
