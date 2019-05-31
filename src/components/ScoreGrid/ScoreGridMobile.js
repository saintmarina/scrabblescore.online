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
          {game._getCurrentPlayer().map((_, i) => (
            game.players.map((player, j) => (
              player[i] 
              ? <tbody key='tbody' className="tbody-rows">
                   <tr key={i+10}>
                    {j===0 ? <td colSpan="2">{`Move ${i+1}`}</td> : null}
                   </tr>
                    <tr key={i}>
                      <td>
                        {playerNames[j]}
                      </td>
                      <td>
                        <ScoreGridCell turn={player[i]} language={language} game={game} />
                      </td>
                    </tr>
                    </tbody>
                  : null
                  
              ))
            ))
          }
        
      </table>
    )
  }
}
export default ScoreGridMobile;