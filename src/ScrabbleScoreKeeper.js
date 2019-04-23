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

const emptyWord = {value: '', modifiers: [], score: 0};


class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleSetGame = this.handleSetGame.bind(this);
    this.renderTieGame = this.renderTieGame.bind(this);
    this.state = {
      game: Game.createNewGame(this.props.playerNames.length),
      currentWord: emptyWord,
      games: []
    }
  }

  /* DONE rename to handleSetGame() */
   handleSetGame(game) {
    let newGames = [...this.state.games.slice(), this.state.game]
    this.setState({games: newGames, game: game})
  }

  handleUndo() {
    /* DONE take out these two lines */
    let games = this.state.games.slice(0, -1)
    let game = this.state.games[this.state.games.length - 1]
    this.setState({game: game, games: games});
  }

  /* DONE remove. (see below) */
  /* DONE do not use lastGame. Instead use getTotalScore() with a beforeLeftOvers argument.
    getTotalScore() should take a second arguemnt that is the move number until you want to count the total.
    */
  /* DONE take out console.log */
  renderTieGame() {
    let result = []
    let winners = this.state.game.getWinners(true)
    if (winners.length > 1) {
      result.push('Tie game: ')
      for (let i = 0; i < winners.length; i++) {
        result.push(`${this.props.playerNames[i]}: ${this.state.game.getTotalScore(i, true)}`)
      }
      result.join(',')
    } else {
      result.push(this.props.playerNames[[...winners]], ' WON')
    }
    return result
  }

  /* TODO do not pass the games variable to your children. Instead, have a undoDisabled prop */
  render() {
    /* TODO Build a variable that has all the common props */
    /* DONE take out moveIndex */
    /* DONE Remove extra spaces in the h1 */
    return (
      <div className='score-keeper'>
        <ScoreGrid playerNames={this.props.playerNames} game={this.state.game} language={this.props.language} />
        <div>
          {!this.state.game.areLeftOversSubmitted() ?
            <p className="bold">{this.props.playerNames[this.state.game.currentPlayerIndex]}, submit {!this.state.game.isGameOver() ? "a word:" : "your leftovers:"}</p> :
            <div>
            {this.state.game.getWinners().length > 1 ? 
              <h1>{this.renderTieGame()}</h1> : 
              <h1>{this.props.playerNames[[...this.state.game.getWinners()]]}, WON</h1>
            }
            </div>
          }
          {!this.state.game.isGameOver() ?
            <InGameControls onSetGame={this.handleSetGame}
                            onUndo={this.handleUndo}
                            undoDisabled={this.state.games.length === 0}
                            game={this.state.game} 
                            language={this.props.language} /> :
            <InGameOverControls onSetGame={this.handleSetGame}
                                onUndo={this.handleUndo}
                                game={this.state.game}
                                undoDisabled={this.state.games.length === 0}
                                language={this.props.language} />
          }
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

  handleUndo(){
    this.props.onUndo();
    this._resetCurrentWord()
  }

  _resetCurrentWord() {
    this.setState({currentWord: emptyWord})
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
    game = game.endTurn()
    /* DONE refactor (no else), and the big line needs to be broken down */
    if (this.props.game.currentPlayerIndex === this.props.game.players.length - 1) {
      game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers())
    } 
    this.props.onSetGame(game)
    this._resetCurrentWord()
  }

  render() {
    /* TODO the button "submit leftovers" should say "submit no leftovers" */
    return (
      <div>
      {!this.props.game.areLeftOversSubmitted() ? 
        <div>
        <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord} language={this.props.language} />
        <CurrentScore score={this.state.currentWord.score} />
          <button onClick={this.handleUndo} type="submit" className="btn btn-info word-submit-button" disabled={this.props.undoDisabled}>UNDO</button>
          <button onClick={this.handleLeftOvers} type="submit" className="btn btn-danger end-game">SUBMIT LEFTOVERS</button>
        </div> :
        <div>
          <button onClick={this.handleUndo} type="submit" className="btn btn-info word-submit-button" disabled={this.props.undoDisabled}>UNDO</button>
        </div>
      }
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
    /* TODO split this big line */
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
          <button onClick={this.handleUndo} type="submit" className="btn btn-info word-submit-button" disabled={this.props.undoDisabled}>UNDO</button>
          <button onClick={this.handleAddWord} className="btn btn-info word-submit-button" disabled={this.state.currentWord.value === ''}>+ ADD A WORD</button>
          <button onClick={this.handleEndTurn} type="submit" className="btn btn-info pass-endturn-button">{(this.props.game.getCurrentTurn().isEmpty()) && (this.state.currentWord.value === '') ? 'PASS' : 'END TURN'}</button>
          <div className="custom-control custom-switch">
            <input onChange={this.handleBingo} type="checkbox" className="custom-control-input" id="bingoToggle" checked={this.props.game.getCurrentTurn().bingo} />
            <label className="custom-control-label" htmlFor="bingoToggle">BINGO</label>
          </div>
          <button onClick={this.handleEndGame} type="submit" className="btn btn-danger end-game" disabled={this.props.game.currentPlayerIndex !== 0 || this.props.game.getCurrentTurn().score > 0} >END GAME</button>
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

/*
DONE fixme: end game button shows up when I add two words on the first turn
DONE End turn should say "PASS" if the turn is empty and word won't be added. The button should not change size when the label chagnes
DONE Undo button for the end game situation
DONE show results should happen automatically, and only undo should appear.
DONE show results crashes when everyone has leftovers
*/
