import React from 'react';
import GameSettings from './GameSettings.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';
import Game from './game.js';
import {scrabbleScore} from './Util.js';
import ScoreGrid from './ScoreGrid.js';

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

  handleSetGame(game) {
    let newGames = [...this.state.games.slice(), this.state.game]
    this.setState({games: newGames, game: game})
  }

  handleUndo() {
    let games = this.state.games.slice(0, -1)
    let game = this.state.games[this.state.games.length - 1]
    this.setState({game: game, games: games});
  }

  renderTieGame() {
    let winners = this.state.game.getWinners(false)
    return winners.map(winnerIndex => winners.length > 1 ? 
      `${this.props.playerNames[winnerIndex]}: ${this.state.game.getTotalScore(winnerIndex, false)}` :
      `${this.props.playerNames[winnerIndex]} WON`).join(', ') 
  }

  render() {
    const callPlayerToAction = `${this.props.playerNames[this.state.game.currentPlayerIndex]}, submit ${!this.state.game.isGameOver() ?
      "a word:" : "your leftovers:"}`

/* TODO  const game = this.state.game */
      /*TODO call this controlsProps */
    const props = {onSetGame: this.handleSetGame,
                   onUndo: this.handleUndo,
                   undoDisabled: this.state.games.length === 0,
                   game: this.state.game,
                   language: this.props.language}
    return (
      <div className='score-keeper'>
        <ScoreGrid playerNames={this.props.playerNames} game={this.state.game} language={this.props.language} />
        <div>
          {!this.state.game.areLeftOversSubmitted() ?
            <p className="bold">{callPlayerToAction}</p> :
            <div className='winner'>
            {this.state.game.getWinners().length > 1 ? 
              <h1>{this.renderTieGame()}</h1> : 
              <h1>{this.props.playerNames[[...this.state.game.getWinners()]]} WON</h1>
            }
            </div>
          }
          {!this.state.game.isGameOver() ?
            <InGameControls {...props} /> :
            <InGameOverControls {...props} />
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
    this.state = {
      currentWord: emptyWord
    }
  }
  _resetCurrentWord() {
    this.setState({currentWord: emptyWord})
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

  handleEndTurn() {
    let game = this.state.currentWord.value.length !== 0 ? this.props.game.addWord(this.state.currentWord) : this.props.game;
    this._onSetGame(game.endTurn());
  }

  handleBingo() {
    this.props.onSetGame(this.props.game.setBingo(!this.props.game.getCurrentTurn().bingo))
  }

  handleEndGame() {
    this.props.onSetGame(this.props.game.endGame())
  }
  
  render() {
    const endTurnButtonText = this.props.game.getCurrentTurn().isEmpty() && this.state.currentWord.value === '' ? 'PASS' : 'END TURN'
    const isEndGameButtonDisabled = this.props.game.currentPlayerIndex !== 0 || this.state.currentWord.value !== '' || this.props.game.getCurrentTurn().score > 0
    return (
      <div>
        <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord} language={this.props.language} />
        <CurrentScore score={this.state.currentWord.score} />
        <div>
          <button onClick={this.handleUndo} type="submit" className="btn btn-info word-submit-button" disabled={this.props.undoDisabled}>UNDO</button>
          <button onClick={this.handleAddWord} className="btn btn-info word-submit-button" disabled={this.state.currentWord.value === ''}>+ ADD A WORD</button>
          <button onClick={this.handleEndTurn} type="submit" className="btn btn-info pass-endturn-button">{endTurnButtonText}</button>
          <div className="custom-control custom-switch">
            <input onChange={this.handleBingo} type="checkbox" className="custom-control-input" id="bingoToggle" checked={this.props.game.getCurrentTurn().bingo} />
            <label className="custom-control-label" htmlFor="bingoToggle">BINGO</label>
          </div>
          <button onClick={this.handleEndGame} type="submit" className="btn btn-danger end-game" disabled={isEndGameButtonDisabled}>END GAME</button>
        </div>
      </div>
    )
  }
}

class InGameOverControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleLeftOvers = this.handleLeftOvers.bind(this);
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

  handleLeftOvers() {
    let game = this.state.currentWord.value.length !== 0 ? this.props.game.addWord(this.state.currentWord) : this.props.game;
    game = game.endTurn()
    game = this.props.game.currentPlayerIndex === this.props.game.players.length - 1 ? 
    game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers()) : game;
    this.props.onSetGame(game)
    this._resetCurrentWord()
  }

  render() {
    const submitButtonText = this.state.currentWord.value.length > 0 ? "SUBMIT LEFTOVERS" : "SUBMIT NO LEFTOVERS"; 
    return (
      <div>
        {!this.props.game.areLeftOversSubmitted() ? 
          <div>
            <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord} language={this.props.language} />
            <CurrentScore score={this.state.currentWord.score} />
            <button onClick={this.handleUndo} type="submit" className="btn btn-info word-submit-button" disabled={this.props.undoDisabled}>UNDO</button>
            <button onClick={this.handleLeftOvers} type="submit" className="btn btn-danger end-game">{submitButtonText}</button>
          </div> :
          <div>
            <button onClick={this.handleUndo} type="submit" className="btn btn-info word-submit-button" disabled={this.props.undoDisabled}>UNDO</button>
          </div>
        }
      </div>
    )
  }
}

class CurrentScore extends React.Component {
  render() {
    return(
      <div id="score" className="card-header">
        Score is {this.props.score}
      </div>
    )
  }
}

/* TODO take out debug mode */
class ScrabbleScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.debug ?
      {
        playerNames: ['Anna', 'Nico'],
        language: 'en',
      } :
      {
        playerNames: [],
        language: '',
      }
  }

  handleGameStart(playerNames, language) {
    this.setState({playerNames: playerNames, language: language});
  }

  renderGame() {
    return this.state.playerNames.length === 0 ? 
      <GameSettings onGameStart={this.handleGameStart.bind(this)} /> :
      <ScoreKeeper playerNames={this.state.playerNames} language={this.state.language} />
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
