import {resizeArray, scrabbleScore} from './Util.js';
class Turn {
  constructor(words, bingo) {
    this.words = words;
    this.bingo = bingo
  }

  /*get score() {
    let result = 0;
    for (let i = 0; i < this.words.length; i++) {
      result += this.words[i].score
      }

    if (this.bingo) {
      result += 50;
    }
  }*/
}

export default class Game {
  constructor(players, currentPlayerIndex) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.players = players;
  }

  static createNewGame(numberOfPlayers) {
    let turn = new Turn([], false)
    let players = resizeArray([[turn]], numberOfPlayers, []);
    return new Game(players, 0);
  }

  addWord(word) {
    let currentTurn = this._getCurrentTurn()
    let turn = new Turn([...currentTurn.words, word], currentTurn.bingo)
    let currentPlayerCopy = this._getCurrentPlayer().slice();
    currentPlayerCopy[this.getCurrentTurnNumber()] = turn;
 
 
    let newPlayers = this.players.map((player, playerIndex) => playerIndex === this.currentPlayerIndex ? currentPlayerCopy : player);

    return new Game (newPlayers, this.currentPlayerIndex)
  }

  endTurn(word) {
    let newTurn = new Turn([], false)
    let newPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    let players = this.players.map((history, playerIndex) => playerIndex === newPlayerIndex ? [...history, newTurn] : history)
    
    return new Game(players, newPlayerIndex);
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
  setBingo(value) {
    let turn = new Turn(this._getCurrentTurn().words, value)
    let currentPlayerCopy = this._getCurrentPlayer().slice();
    currentPlayerCopy[this.getCurrentTurnNumber()] = turn;
    let newPlayers = this.players.map((player, playerIndex) => playerIndex === this.currentPlayerIndex ? currentPlayerCopy : player);
    return new Game(newPlayers, this.currentPlayerIndex)
  }

  getTotalScore(playerIndex) {
    let result = 0;
    for ( let i = 0; i < (this.players[playerIndex].length); i++) {
      for (let j = 0; j <(this.players[playerIndex][i].length); j++) {
        result += this.players[playerIndex][i][j].score
    }}
    return result  };
}
