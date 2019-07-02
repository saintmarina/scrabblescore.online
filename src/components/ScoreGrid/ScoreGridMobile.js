import React from 'react';
import ScoreGridCell from './ScoreGridCell';
import CallPlayerToAction from '../ScrabbleScoreKeeper/CallPlayerToAction';
import './ScoreGrid.css';

class ScoreGridMobile extends React.Component {
  render() {
    const { playerNames, game, language } = this.props;
    const totalScores = [...Array(playerNames.length)].map((_, j) => {
      return game.getRunningTotals(j)
    });
    var isCurrentPlayersTurn = (player, turnIndex) => player === game.getCurrentPlayer() && player[turnIndex].isEmpty() && !player[turnIndex].isPassed(game) && !player[turnIndex].bingo

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
            const playerRows = game.playersTurns.map((player, j) => (
              player[i]
                ? <tr key={`move${i}_player${j}`}>
                    <td>
                      {playerNames[j]}<br />{isCurrentPlayersTurn(player, i) ? null : totalScores[j][i]}
                    </td>

                    <td>
                      {isCurrentPlayersTurn(player, i) 
                        ? <CallPlayerToAction game={game} playerNames={playerNames} isMobile={true}/>
                        : <ScoreGridCell turn={player[i]} language={language} game={game} />
                      }
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