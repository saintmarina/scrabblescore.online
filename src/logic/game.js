import {resizeArray, indexesOf} from "./util.js";

class Turn {
  /* DONE Add test for passed display in the scoregrid */
  /* DONE once test are added, refactor to take out the passed variable from Turn */
  constructor(words, bingo) {
    this.words = words;
    this.bingo = bingo;
  }

  static empty() {
    return new Turn([], false);
  }

  isEmpty() {
    return this.words.length === 0;
  }

  isPassed(game) {
    return this.isEmpty() && this !== game.getCurrentTurn()
  }

  get score() {
    let result = 0;
    for (let i = 0; i < this.words.length; i++) {
      result += this.words[i].score
    }

    if (this.bingo) {
      result += 50;
    }

    return result
  }
}

export default class Game {
  constructor(players, currentPlayerIndex, leftOversTurnNumber) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.players = players;
    this.leftOversTurnNumber = leftOversTurnNumber
  }

  static createNewGame(numberOfPlayers) {
    let turn = Turn.empty()
    let players = resizeArray([[turn]], numberOfPlayers, []);
    return new Game(players, 0, null);
  }

  addWord(word) {
    let currentTurn = this.getCurrentTurn()
    let turn = new Turn([...currentTurn.words, word], currentTurn.bingo)
    return this._setTurn(this.currentPlayerIndex, this.getCurrentTurnNumber(), turn)
  }

  endTurn(word) {
    let newGame = this;
    if (this.getCurrentTurn().isEmpty()) {
      newGame = this._setTurn(this.currentPlayerIndex, this.getCurrentTurnNumber(), Turn.empty())
    }
    let newPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    let players = this.isGameOver() && (this._getCurrentPlayer() === this.players[this.players.length - 1]) ? newGame.players :
    newGame.players.map((history, playerIndex) => playerIndex === newPlayerIndex ? [...history, Turn.empty()] : history)
    return new Game(players, newPlayerIndex, this.leftOversTurnNumber);
  }

  setBingo(value) {
    let turn = new Turn(this.getCurrentTurn().words, value)
    return this._setTurn(this.currentPlayerIndex, this.getCurrentTurnNumber(), turn)
  }

  endGame() {
    return new Game(this.players, this.currentPlayerIndex, this.getCurrentTurnNumber())
  }

  isGameOver() {
    return this.leftOversTurnNumber !== null
  }

  areLeftOversSubmitted() {
    if (this.isGameOver() && this.players[this.players.length - 1][this.leftOversTurnNumber] && this.currentPlayerIndex === 0){
      return true
    } else {
      return false
    }
  }

  getReapers() {
    let reaperIndexes = []
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i][this.leftOversTurnNumber].isEmpty()) {
        reaperIndexes.push(i)
      }
    }
    return reaperIndexes
  }

  getSumOfLeftovers() {
    let total = 0;
    for (let i = 0; i < this.players.length; i++) {
      total += Math.abs(this.players[i][this.leftOversTurnNumber].score)
    }
    return total
  }

  distributeLeftOversToReapers(reapers, totalLeftOverScore) {
    let game = this;
    reapers.forEach(reaperIndex => {
      let turn =  new Turn([{value: "", modifiers: [], score: totalLeftOverScore}], false)
      game = game._setTurn(reaperIndex, this.leftOversTurnNumber, turn) 
    })
    return game
  }

  getWinners(lastTurn=true) {
    let totalScores = this.players.map((_, i) => this.getTotalScore(i, lastTurn))
    return indexesOf(totalScores, Math.max(...totalScores))
    
  }

  _setTurn(playerIndex, turnNumber, turn) {
      let playerCopy = this.players[playerIndex].slice();
      playerCopy[turnNumber] = turn;
      let newPlayers = this.players.map((player, i) => i === playerIndex ? playerCopy : player);
      return new Game (newPlayers, this.currentPlayerIndex, this.leftOversTurnNumber)
  }
  
  _getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getCurrentTurn() {
    return this._getCurrentPlayer().slice(-1)[0];
  }

  getCurrentTurnNumber() {
    return this.players[0].length - 1
  }

  getCurrentPlayerIndex() {
    return this.currentPlayerIndex;
  }
  
  getTotalScore(playerIndex, lastTurn=true) {
    let player = this.players[playerIndex]
    let result = 0
    let numTurns = lastTurn ? player.length : player.length - 1
    for (let i = 0; i < numTurns; i++) {
        result += player[i].score
    }
    return result
  };
}