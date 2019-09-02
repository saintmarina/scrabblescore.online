import ReactGA from 'react-ga';
import React from 'react';
import GameSettings from '../GameSettings/GameSettings';
import ScoreKeeper from './ScoreKeeper';
import './ScrabbleScoreKeeper.css';
import { logEvent } from '../../logic/util';


class ScrabbleScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    this.handlePopState = this.handlePopState.bind(this);

    /*
      DO NOT CHANGE INITIAL STATE:
      the initial rendering of the component and the static rendering must be the same
    */
    this.state = {
      playerNames: [],
      language: 'en',
      width: 10,
    };
  }

  static maybeResetLocalStorage() {
    if (!window.localStorage.getItem('ScrabbleScoreKeeperState'))
      return;
    
    if (window.confirm('You have a game in progress.\nWould you like to resume it?'))
      logEvent('game-resume')
      return;

    window.localStorage.removeItem('ScrabbleScoreKeeperState');
    window.localStorage.removeItem('ScoreKeeperState');
  }

  componentDidMount() {
    /* - pushState() allows to modifiy browser history entries;
       - popstate listens for changes in browser history,like back/front button click;
       - when history is changed, this.handlePopState function is being fired;
       - this.handlePopState changes state for ScrabbleScoreKeeper component;
       - ScrabbleScoreKeeper component rerenders, displaying correct state;
    */

    const { playerNames } = this.state;
    window.history.pushState({ playerNames: playerNames }, null) 
    window.addEventListener('popstate', this.handlePopState); 

    ReactGA.initialize('UA-144533310-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
    this.handleWindowSizeChange();

    this.constructor.maybeResetLocalStorage();
    const restoredState = JSON.parse(window.localStorage.getItem('ScrabbleScoreKeeperState'));
    if (restoredState)
      this.setState({playerNames: restoredState.playerNames})
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState(event) {
   const stateObj = event.state;
   this.setState({playerNames: stateObj.playerNames})
  }

  handleWindowSizeChange() {
    this.setState({ width: window.innerWidth });
  }

  handleGameStart(playerNames, language) {
    logEvent('start-game', {'player-names': playerNames, 'language': language});
    window.history.pushState({ playerNames: playerNames }, null)
    this.setState({ playerNames, language });

    window.localStorage.setItem('ScrabbleScoreKeeperState', JSON.stringify({playerNames}))
  }

  renderGame(isMobile) {
    const { playerNames, language } = this.state;
    return playerNames.length === 0
      ? <GameSettings onGameStart={this.handleGameStart} />
      : <ScoreKeeper
          playerNames={playerNames}
          language={language}
          isMobile={isMobile}
        />;
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