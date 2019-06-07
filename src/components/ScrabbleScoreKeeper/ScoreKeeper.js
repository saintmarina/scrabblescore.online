import React from 'react';
import PropTypes from 'prop-types';
import Game from '../../logic/game';
import ScoreGrid from '../ScoreGrid/ScoreGrid';
import ScoreGridMobile from '../ScoreGrid/ScoreGridMobile';
import InGameControls from './InGameControls';
import InGameOverControls from './InGameOverControls';

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleSetGame = this.handleSetGame.bind(this);
    this.renderTieGame = this.renderTieGame.bind(this);
    const { playerNames } = this.props;
    this.state = {
      game: Game.createNewGame(playerNames.length),
      games: [],
    };
  }

  handleSetGame(currentGame) {
    let { game, games } = this.state;
    games = [...games.slice(), game];
    this.setState({ games, game: currentGame });
  }

  handleUndo() {
    const { games } = this.state;
    const previousGames = games.slice(0, -1);
    const game = games[games.length - 1];
    this.setState({ game, games: previousGames });
  }

  renderTieGame() {
    const { game } = this.state;
    const { playerNames } = this.props;
    const winners = game.getWinners(false);
    return winners.map(winnerIndex => (winners.length > 1
      ? `${playerNames[winnerIndex]}: ${game.getTotalScore(winnerIndex, false)}`
      : `${playerNames[winnerIndex]} WON`)).join(', ');
  }

  render() {
    const { game, games } = this.state;
    const { playerNames, language, isMobile } = this.props;
    const callPlayerToAction = `${playerNames[game.currentPlayerIndex]}, submit ${!game.isGameOver()
                                  ? 'a word:'
                                  : 'your leftovers:'}`
                                 

    const controlProps = {
      onSetGame: this.handleSetGame,
      onUndo: this.handleUndo,
      undoDisabled: games.length === 0,
      isMobile,
      game,
      language,
    };
    return (
      <div className="score-keeper">
      {isMobile
        ? <ScoreGridMobile playerNames={playerNames} game={game} language={language} />
        : <ScoreGrid playerNames={playerNames} game={game} language={language} />
      }
        <div>
          {!game.areLeftOversSubmitted()
            ? <p className="bold">{callPlayerToAction}</p>
            : (
              <div className="winner">
                {game.getWinners().length > 1
                  ? <h1>{this.renderTieGame()}</h1>
                  : (
                    <h1>
                      {`${playerNames[[...game.getWinners()]]} WON`}
                    </h1>
                  )
                }
              </div>
            )
          }
          {!game.isGameOver()
            ? <InGameControls {...controlProps} />
            : <InGameOverControls {...controlProps} />
          }
        </div>
      </div>
    );
  }
}

ScoreKeeper.propTypes = {
  playerNames: PropTypes.arrayOf(PropTypes.string),
  language: PropTypes.string,
};

ScoreKeeper.defaultProps = {
  playerNames: ['Player 1', 'Player 2'],
  language: 'en',
};

export default ScoreKeeper;
