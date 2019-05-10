import React from 'react';
import GameSettings from './GameSettings';
import ScrabbleInputBox from './ScrabbleInputBox';
import Game from '../logic/game';
import {scrabbleScore} from '../logic/util';
import ScoreGrid from './ScoreGrid';
import './ScrabbleScoreKeeper.css';

const emptyWord = {value: '', modifiers: [], score: 0};

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleSetGame = this.handleSetGame.bind(this);
    this.renderTieGame = this.renderTieGame.bind(this);
    this.state = {
      game: Game.createNewGame(this.props.playerNames.length),
      games: []
    }
  }

  handleSetGame(myGame) {
    const { game, games } = this.state;
    let newGames = [...games.slice(), game]
    this.setState({games: newGames, game: myGame})
  }

  handleUndo() {
    const { games } = this.state;
    let myGames = games.slice(0, -1)
    let myGame = games[games.length - 1]
    this.setState({game: myGame, games: myGames});
  }

  renderTieGame() {
    const { game } = this.state;
    const { playerNames } = this.props;
    let winners = game.getWinners(false);
    return winners.map(winnerIndex => winners.length > 1 ?
      `${playerNames[winnerIndex]}: ${game.getTotalScore(winnerIndex, false)}` :
      `${playerNames[winnerIndex]} WON`).join(', ');
  }

  render() {
    const { game, games } = this.state; 
    const { playerNames, language } = this.props
    const callPlayerToAction = `${playerNames[game.currentPlayerIndex]}, submit ${!game.isGameOver() ?
      "a word:" : "your leftovers:"}`

    const controlProps = {onSetGame: this.handleSetGame,
                   onUndo: this.handleUndo,
                   undoDisabled: games.length === 0,
                   game: game,
                   language: language}
    return (
      <div className='score-keeper'>
        <ScoreGrid playerNames={playerNames} game={game} language={language} />
        <div>
          {!game.areLeftOversSubmitted() ?
            <p className="bold">{callPlayerToAction}</p> :
            <div className='winner'>
            {game.getWinners().length > 1 ?
              <h1>{this.renderTieGame()}</h1> : 
              <h1>{playerNames[[...game.getWinners()]]} WON</h1>
            }
            </div>
          }
          {!game.isGameOver() ?
            <InGameControls {...controlProps} /> :
            <InGameOverControls {...controlProps} />
          }
        </div>
      </div>
    )
  }
}

class InGameControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleEndTurn = this.handleEndTurn.bind(this);
    this.handleEndGame = this.handleEndGame.bind(this);
    this.handleAddWord =this.handleAddWord.bind(this);
    this.handleBingo = this.handleBingo.bind(this);
    this.input = React.createRef()
    this.state = {
      currentWord: emptyWord
    }
  }
  _resetCurrentWord() {
    this.setState({currentWord: emptyWord})
    this.input.current.focus()
  }

  _onSetGame(game) {
    this.props.onSetGame(game)
    this._resetCurrentWord()
  }

  handleChange(word) {
    let _word = {...word, score: scrabbleScore(word.value, word.modifiers, this.props.language)}
    this.setState({currentWord: _word});
  }

  handleUndo(){
    this.props.onUndo();
    this._resetCurrentWord()
  }

  handleAddWord() {
    
    this._onSetGame(this.props.game.addWord(this.state.currentWord))
  }

  handleEndTurn(e) {
    const { currentWord } = this.state;
    const { game } = this.props;
    e.preventDefault()  /* prevent form submission */
    let myGame = currentWord.value.length !== 0 ? game.addWord(currentWord) : game;
    this._onSetGame(myGame.endTurn());
  }

  handleBingo() {
    const { game } = this.props;
    this.props.onSetGame(game.setBingo(!game.getCurrentTurn().bingo))
  }

  handleEndGame() {
    this.props.onSetGame(this.props.game.endGame())
  }

  componentDidMount() {
    this.input.current.focus()
  }
  
  render() {
    const { currentWord } = this.state;
    const { game, language, undoDisabled } = this.props;
    const endTurnButtonText = game.getCurrentTurn().isEmpty() && currentWord.value === '' ? 'PASS' : 'END TURN'
    const isEndGameButtonDisabled = game.currentPlayerIndex !== 0 || currentWord.value !== '' || game.getCurrentTurn().score > 0
    return (
      <form autoComplete='off'>
        <ScrabbleInputBox ref={this.input} onChange={this.handleChange} word={currentWord} language={language} />
        <CurrentScore score={currentWord.score} />
        <div>
          <button onClick={this.handleUndo} type="button" className="btn btn-info word-submit-button" disabled={undoDisabled}>UNDO</button>
          <button onClick={this.handleAddWord} type="button" className="btn btn-info word-submit-button" disabled={currentWord.value === ''}>+ ADD A WORD</button>
          <button onClick={this.handleEndTurn} type="submit" className="btn btn-info pass-endturn-button">{endTurnButtonText}</button>
          <div className="custom-control custom-switch">
            <input onChange={this.handleBingo} type="checkbox" className="custom-control-input" id="bingoToggle" checked={game.getCurrentTurn().bingo} />
            <label className="custom-control-label" htmlFor="bingoToggle">BINGO</label>
          </div>
          <button onClick={this.handleEndGame} type="button" className="btn btn-danger end-game" disabled={isEndGameButtonDisabled}>END GAME</button>
        </div>
      </form>
    )
  }
}

class InGameOverControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleLeftOvers = this.handleLeftOvers.bind(this);
    this.input = React.createRef()
    this.state = {
      currentWord: emptyWord,
    }
  }

  _resetCurrentWord() {
    this.setState({currentWord: emptyWord})
  }

  handleUndo(){
    this.props.onUndo();
    this._resetCurrentWord()
  }

  handleChange(word) {
    let _word = {...word, score: -scrabbleScore(word.value, word.modifiers, this.props.language)}
    this.setState({currentWord: _word});
  }

  handleLeftOvers(e) {
    const {game, onSetGame} = this.props;
    e.preventDefault() /* prevent form submission */
    let myGame = this.state.currentWord.value.length !== 0 ? game.addWord(this.state.currentWord) : game;
    myGame = myGame.endTurn()
    myGame = game.currentPlayerIndex === game.players.length - 1 ? 
    myGame.distributeLeftOversToReapers(myGame.getReapers(), myGame.getSumOfLeftovers()) : myGame;
    onSetGame(myGame)
    this._resetCurrentWord()
  }

  componentDidMount() {
    this.input.current.focus()
  }

  render() {
    const { currentWord } = this.state;
    const { game, language, undoDisabled } = this.props
    const submitButtonText = currentWord.value.length > 0 ? "SUBMIT LEFTOVERS" : "SUBMIT NO LEFTOVERS"; 
    return (
      <div>
        {!game.areLeftOversSubmitted() ? 
          <form autoComplete='off'>
            <ScrabbleInputBox ref={this.input} onChange={this.handleChange} word={currentWord} language={language} />
            <CurrentScore score={currentWord.score} />
            <button onClick={this.handleUndo} type="button" className="btn btn-info word-submit-button" disabled={undoDisabled}>UNDO</button>
            <button onClick={this.handleLeftOvers} type="submit" className="btn btn-danger end-game">{submitButtonText}</button>
          </form> :
          <div>
            <button onClick={this.handleUndo} type="button" className="btn btn-info word-submit-button" disabled={undoDisabled}>UNDO</button>
          </div>
        }
      </div>
    )
  }
}

class CurrentScore extends React.Component {
  render() {
    return(
      <div className="card-header current_score">
        Score is {this.props.score}
      </div>
    )
  }
}

class ScrabbleScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        playerNames: [],
        language: '',
      }
  }

  handleGameStart(playerNames, language) {
    this.setState({playerNames: playerNames, language: language});
  }

  renderGame() {
    const { playerNames, language } = this.state;
    return playerNames.length === 0 ? 
      <GameSettings onGameStart={this.handleGameStart.bind(this)} /> :
      <ScoreKeeper playerNames={playerNames} language={language} />
  }

  render() {
    return (
      <div className='main'>
        <h1> Scrabble score keeper</h1>
        {this.renderGame()}
      </div>
    );
  }
}

export default ScrabbleScoreKeeper;

/*TODO:
- use lint to correct the code format (use airbnb plug in)
- research on how to organize files in src directory (make a css file per component). 
- use airbnb js style guide to refactor your code 
X change all this.state to ==>   const { width } = this.state;
- fix blinker bug*/
