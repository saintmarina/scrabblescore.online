import React from 'react';
import GameSettings from '../GameSettings/GameSettings';
import ScoreKeeper from './ScoreKeeper';
import './ScrabbleScoreKeeper.css';

class ScrabbleScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.state = {
      playerNames: [],
      language: '',
    };
  }

  handleGameStart(playerNames, language) {
    this.setState({ playerNames, language });
  }

  renderGame() {
    const { playerNames, language } = this.state;
    return playerNames.length === 0
      ? <GameSettings onGameStart={this.handleGameStart} />
      : <ScoreKeeper playerNames={playerNames} language={language} />;
  }

  render() {
    return (
      <div className="main">
        <h1> Scrabble score keeper</h1>
        {this.renderGame()}
      </div>
    );
  }
}

export default ScrabbleScoreKeeper;

/* TODO:
- use lint to correct the code format (use airbnb plug in)
X research on how to organize files in src directory (make a css file per component).
- use airbnb js style guide to refactor your code
X change all this.state to ==>   const { width } = this.state;
X fix blinker bug
X css for every component


*/
