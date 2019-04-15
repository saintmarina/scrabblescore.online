import React from 'react';
import GameSettings from './GameSettings.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';
import Game from './game.js';
import {scrabbleScore} from './Util.js';
import ScoreGrid from './ScoreGrid.js';

/* TODO
      Here we see that the endGame logic difference is really in the buttons.
      So let's have two components that renders different buttons depending if we are in an endGame.
      this component only handles undoes and displaying new games.
      
      scoreKepper exposes to his control childs the following functions as props:
        * setGame(newGame)
        * undoGame()
      scoreKeeper also passes the props:
        * language
        * game



      ScoreKeeper # keeps track of the undo logic, etc.
        ScoreGrid
        InGameControls 
          ScrabbleInputBox
          buttons
          buttons
        EndGameControls
          ScrabbleInputBox
          buttons
          buttons
    */

const debug = true;
const emptyWord = {value: '', modifiers: [], score: 0};


class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleUndo = this.handleUndo.bind(this);
    this._setGame = this._setGame.bind(this);
    this.state = {
      game: Game.createNewGame(this.props.playerNames.length),
      currentWord: emptyWord,
      games: []
    }
  }

   _setGame(game) {
    let newGames = [...this.state.games.slice(), this.state.game]
    console.log(game)
    this.setState({games: newGames, game: game})
  }

  handleUndo() {
    if (this.state.games.length === 0)
      return;

    let games = this.state.games.slice(0, -1)
    let game = this.state.games[this.state.games.length - 1]
    this.setState({game: game, games: games});
  }

  render() {
    return (
      <div className='score-keeper'>
        <ScoreGrid playerNames={this.props.playerNames} game={this.state.game} language={this.props.language} />
        <div>
          <p className="bold">{this.props.playerNames[this.state.game.currentPlayerIndex]}, submit a word:</p>
            {!this.state.game.isGameOver() ? 
              <InGameControls onSetGame={this._setGame} 
                              onUndo={this.handleUndo} 
                              games={this.state.games}
                              game={this.state.game} 
                              language={this.props.language} /> : 
              <InGameOverControls onSetGame={this._setGame} 
                                  game={this.state.game}
                                  language={this.props.language}
                                  moveIndex={this.state.game.getCurrentTurnNumber() - 1} />}
        </div>
      </div>
    )
  }
}

class InGameOverControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleLeftOvers = this.handleLeftOvers.bind(this);
    this.state = {
      currentWord: emptyWord,
      lastMoveIndex: this.props.moveIndex
    }
  }

  _resetCurrentWord() {
    this.setState({currentWord: emptyWord})
  }
  _checkLeftOvers() {

  }


  handleChange(word) {
    let _word = {...word, score: -scrabbleScore(word.value, word.modifiers, this.props.language)}
    this.setState({currentWord: _word});
  }

  handleLeftOvers() {

    let game = this.props.game;
    if (this.state.currentWord.value.length !== 0) {
      game = game.addWord(this.state.currentWord)
    }
    this.props.onSetGame(game.endTurn());
    this._resetCurrentWord()
  }

  render() {
    return (
      <div>
        <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord} language={this.props.language} />
        {console.log(this.props.game.getCurrentTurnNumber())}
        <CurrentScore score={this.state.currentWord.score} />
        {console.log(this.props.game.currentPlayerIndex)}
        {!this.props.game.areLeftOversSubmitted() ? 
        <button onClick={this.handleLeftOvers} type="submit" className="btn btn-danger end-game">SUBMIT LEFTOVERS</button> :
        <h1> IT'S OVER</h1>}
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

  handleChange(word) {
    let _word = {...word, score: scrabbleScore(word.value, word.modifiers, this.props.language)}
    this.setState({currentWord: _word});
  }

  handleUndo(){
    this.props.onUndo();
    this._resetCurrentWord()

  }

  handleAddWord() {
    this.props.onSetGame(this.props.game.addWord(this.state.currentWord))
    this._resetCurrentWord()
  }

  handleEndTurn() {
    let game = this.props.game;
    if (this.state.currentWord.value.length !== 0) {
      game = game.addWord(this.state.currentWord)
    }
    this.props.onSetGame(game.endTurn());
    this._resetCurrentWord()
  }

  handleBingo() {
    this.props.onSetGame(this.props.game.setBingo(!this.props.game.getCurrentTurn().bingo))
  }

  handleEndGame() {
    this.props.onSetGame(this.props.game.endGame())
  }

  render() {
    return (
      <div>
        <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord} language={this.props.language} />
        <CurrentScore score={this.state.currentWord.score} />
        <div>
          <button onClick={this.handleUndo} type="submit" className="btn btn-info word-submit-button" disabled={this.props.games.length === 0}>UNDO</button>
          <button onClick={this.handleAddWord} className="btn btn-info word-submit-button" disabled={this.state.currentWord.value === ''}>+ ADD A WORD</button>
          <button onClick={this.handleEndTurn} type="submit" className="btn btn-info word-submit-button">END TURN</button>
          <div className="custom-control custom-switch">
            <input onChange={this.handleBingo} type="checkbox" className="custom-control-input" id="bingoToggle" checked={this.props.game.getCurrentTurn().bingo} />
            <label className="custom-control-label" htmlFor="bingoToggle">BINGO</label>
          </div>
          <button onClick={this.handleEndGame} type="submit" className="btn btn-danger end-game" disabled={this.props.game.currentPlayerIndex !== 0 || this.props.game.getCurrentTurn().words.length === 1} >END GAME</button>
          
        </div>
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

class ScrabbleScoreKeeper extends React.Component {
  state = debug ? {
    playerNames: ['Anna', 'Nico'],
    language: 'en',
  } :
  {
    playerNames: [],
    language: '',
  }

  handleGameStart(playerNames, language) {
    this.setState({playerNames: playerNames, language: language});
  }

  renderGame() {
    return this.state.playerNames.length === 0 ? 
      <GameSettings onGameStart={this.handleGameStart.bind(this)} /> :
      <ScoreKeeper playerNames={this.state.playerNames} language={this.state.language} />;
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

/*
X In ScrabbleInputBox, filter out letters that are on the scorelist, instead of doing isLetter().
- Think about implementing the end of the game.
- Write more integration tests
*/