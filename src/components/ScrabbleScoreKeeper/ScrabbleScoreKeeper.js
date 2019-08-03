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
      width: 10,
    };
  }

  componentDidMount() {
    ReactGA.initialize('UA-144533310-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
    this.handleWindowSizeChange();
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

  renderGame(isMobile) {
    const { playerNames, language } = this.state;
    return playerNames.length === 0
      ? <GameSettings onGameStart={this.handleGameStart}/>
      : <ScoreKeeper playerNames={playerNames} language={language} isMobile={isMobile} />;
  }

  render() {
    const { width } = this.state;
    const isMobile = width <= 815;
    return (
      <div className={`main ${isMobile ? 'mobile' : 'desktop'}`}>
        {this.renderGame(isMobile)}
      </div>
    );
  }
}

export default ScrabbleScoreKeeper;
