import React from 'react';
import PropTypes from 'prop-types';
import Game from '../../logic/game';
import ScoreGrid from '../ScoreGrid/ScoreGrid';
import ScoreGridMobile from '../ScoreGrid/ScoreGridMobile';
import CallPlayerToAction from './CallPlayerToAction';
import InGameControls from './InGameControls';
import InGameOverControls from './InGameOverControls';

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleSetGame = this.handleSetGame.bind(this);
    this.renderWinner = this.renderWinner.bind(this);
    this.beforeUnload = this.beforeUnload.bind(this);
    const { playerNames } = this.props;
    this.state = {
      game: Game.createNewGame(playerNames.length),
      games: [],
    };
  }
 
  componentDidMount() {
    window.addEventListener('beforeunload', this.beforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeUnload);  
  }

  beforeUnload(e) {
    const { games, game } = this.state;
    if (process.env.NODE_ENV !== 'development' && games.length !== 0 && !game.isGameOver()) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  handleSetGame(currentGame) {
    const { game } = this.state;
    let { games } = this.state;
    games = [...games.slice(), game];
    this.setState({ games, game: currentGame });
  }

  handleUndo() {
    const { games } = this.state;
    const previousGames = games.slice(0, -1);
    const game = games[games.length - 1];
    this.setState({ game, games: previousGames });

  }

  renderWinner() {
    const { game } = this.state;
    const { playerNames } = this.props;
    const turnBeforeLeftOvers = game.leftOversTurnNumber - 1;
    const winners = game.getWinners();
    const winnersTie = game.getWinners(turnBeforeLeftOvers);
    if (winners.length > 1) {
      return winnersTie.map(winnerIndex => (winnersTie.length > 1
        ? `${playerNames[winnerIndex]}: ${game.getTotalScore(winnerIndex, turnBeforeLeftOvers)} points`
        : `${playerNames[winnerIndex]} won with ${game.getTotalScore(winnerIndex, turnBeforeLeftOvers)} points!`)).join(', ');
    }
    return `${playerNames[[...game.getWinners()]]} won with ${game.getTotalScore([...game.getWinners()])} points!`;
  }

  render() {
    const { game, games } = this.state;
    const { playerNames, language, isMobile } = this.props;

    const controlProps = {
      onSetGame: this.handleSetGame,
      onUndo: this.handleUndo,
      undoDisabled: games.length === 0,
      isMobile,
      game,
      language,
    };

    const toDisplayCallPlayerToAction = () => {
      if (!isMobile) {
        return  <CallPlayerToAction game={game} playerNames={playerNames} isMobile={isMobile}/>
      }
    };

    return (
      <div className="score-keeper">
        <div className="container">
          <img id="logo" src="logo.png" alt="Scrabble score logo" width="212px" />
          <h1 className="title">Scrabble Score Sheet</h1>
          {isMobile
            ? <ScoreGridMobile playerNames={playerNames} game={game} language={language} />
            : <ScoreGrid playerNames={playerNames} game={game} language={language} />
          }
          {!game.areLeftOversSubmitted()
            ? toDisplayCallPlayerToAction()
            : (
              <div className="winner">
                <h1>{this.renderWinner()}</h1>
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
