import React from 'react';
import ScoreGridCell from './ScoreGridCell';
import './ScoreGrid.css';

class ScoreGridMobile extends React.Component {
	render() {
	    const { playerNames, game, language } = this.props;
	    console.log(game.players[game.getCurrentPlayerIndex()].length)
	    return (
	      <table className="table table-bordered" align="center">
	        <thead>
	        	<tr className="thead-rows">
	            <th className="move">Move</th>
	            <th className="playerNames">Player Names</th>
	            <th className="playerTurn">Player Turn</th>
	           </tr>
	        </thead>
	        <tbody className="tbody-rows">
	        {game._getCurrentPlayer().map((_, i) => (
	        	game.players.map((player, j) => (
	        		player[i]
			        		? <tr>
			        				<th>
			        				{i+1}
			        				</th>
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
					)}
			}
export default ScoreGridMobile;


/*  [...Array(currentPlayerLength)].map((_, i) => (
      playerNames.map((name, j) => ( result.push(i)))))
    return result
    */