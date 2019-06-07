import React from 'react';
import ScoreGridCell from './ScoreGridCell';
//import './ScoreGrid.css';

class ScoreGridMobile extends React.Component {
  render() {
    const { playerNames, game, language } = this.props;
    return (
      <table className="table table-bordered" align="center">
        <thead>
          <tr className="thead-rows">
            <th className="playerNames">Names<br />(Total)</th>
            <th className="playerTurn">Player Turn</th>
           </tr>
        </thead>
        <tbody key='tbody' className="tbody-rows">
          {game.getCurrentPlayer().map((_, i) => {
            const moveRow = <tr key={`moverow${i}`} className="move-row">
                              <td colSpan="2">
                                {`Move ${i+1}`}
                              </td>
                            </tr>;
            const playerRows = game.players.map((player, j) => (
              player[i]
                ? <tr key={`move${i}_player${j}`}>
                    <td>
                      {playerNames[j]}<br />{game.getTotalScore(j)}
                    </td>

                    <td>
                      <ScoreGridCell turn={player[i]} language={language} game={game} />
                    </td>
                  </tr>     
                : null
              ))
            return [moveRow, playerRows]
          })}
        </tbody>
      </table>
    )
  }
}
export default ScoreGridMobile;