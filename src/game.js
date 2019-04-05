import {resizeArray} from './Util.js';

class Turn {
  /* DONE add a passed property instead of using the string PASS in the first word array */
  constructor(words, bingo, passed=false) {
    this.words = words;
    this.bingo = bingo;
    this.passed = passed;
  }

  static empty() {
    return new Turn([], false);
  }

  get score() {
    if (this.passed) return 0;

    if (!this.words) return 0;

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
  constructor(players, currentPlayerIndex) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.players = players;
  }

  static createNewGame(numberOfPlayers) {
    let turn = Turn.empty()
    let players = resizeArray([[turn]], numberOfPlayers, []);
    return new Game(players, 0);
  }

  addWord(word) {
    let currentTurn = this.getCurrentTurn()
    let turn = new Turn([...currentTurn.words, word], currentTurn.bingo)
    return this._setTurn(turn)
  }

  endTurn(word) {
    let newGame = this;
    if (this.getCurrentTurn().words.length === 0) {
      let newTurn = new Turn(this.getCurrentTurn().words, this.getCurrentTurn.bingo, true)
      newGame = this._setTurn(newTurn)
    }
    let newPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    /* DONE next line is duplicated in your if and else bodies. It should not */
    let players = newGame.players.map((history, playerIndex) => playerIndex === newPlayerIndex ? [...history, Turn.empty()] : history)
    return new Game(players, newPlayerIndex);
  }

  setBingo(value) {
    let turn = new Turn(this.getCurrentTurn().words, value)
    return this._setTurn(turn)
  }

  _setTurn(turn) {
    let currentPlayerCopy = this._getCurrentPlayer().slice();
    currentPlayerCopy[this.getCurrentTurnNumber()] = turn;
    let newPlayers = this.players.map((player, playerIndex) => playerIndex === this.currentPlayerIndex ? currentPlayerCopy : player);
    return new Game (newPlayers, this.currentPlayerIndex)
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
  
  getTotalScore(playerIndex) {
    let currentPlayer = this.players[playerIndex]
    let result = 0
    for (let i = 0; i < (currentPlayer.length); i++) {
        result += currentPlayer[i].score
    }
    return result
  };
}























