import ReactGA from 'react-ga';
import React from 'react';
import GameSettings from '../GameSettings/GameSettings';
import ScoreKeeper from './ScoreKeeper';
import './ScrabbleScoreKeeper.css';

class ScrabbleScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    this.state = {
      playerNames: [],
      language: '',
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    ReactGA.initialize('UA-144533310-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  

  handleWindowSizeChange() {
    this.setState({ width: window.innerWidth });
  }

  handleGameStart(playerNames, language) {
    this.setState({ playerNames, language });
  }

  renderGame() {
    const { playerNames, language, width } = this.state;
    const isMobile = width <= 815;
    return playerNames.length === 0
      ? <GameSettings onGameStart={this.handleGameStart} isMobile={isMobile}/>
      : <ScoreKeeper playerNames={playerNames} language={language} isMobile={isMobile} />;
  }

  render() {
    const { width } = this.state;
    const isMobile = width <= 815;
    return (
      <div className={`main ${isMobile ? 'mobile' : 'desktop'}`}>
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
