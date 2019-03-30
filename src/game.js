import {resizeArray} from './Util.js';

class Turn {
  constructor(words, bingo) {
    this.words = words;
    this.bingo = bingo
  }

  static empty() {
    return new Turn([], false);
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
    let currentTurn = this._getCurrentTurn()
    let turn = new Turn([...currentTurn.words, word], currentTurn.bingo)
    return this._setTurn(turn)
  }

  endTurn(word) {
    let newPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    let players = this.players.map((history, playerIndex) => playerIndex === newPlayerIndex ? [...history, Turn.empty()] : history)
    return new Game(players, newPlayerIndex);
  }

  setBingo(value) {
    let turn = new Turn(this._getCurrentTurn().words, value)
    return this._setTurn(turn)
  }

  _setTurn(turn) {
    let currentPlayerCopy = this._getCurrentPlayer().slice();
    currentPlayerCopy[this.getCurrentTurnNumber()] = turn;
    let newPlayers = this.players.map((player, playerIndex) => playerIndex === this.currentPlayerIndex ? currentPlayerCopy : player);
    return new Game (newPlayers, this.currentPlayerIndex)
  }

  _getCurrentTurn() {
    return this._getCurrentPlayer().slice(-1)[0];
  }

  _getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
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























