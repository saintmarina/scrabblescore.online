import { resizeArray, indexesOf } from './util';

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

  static fromPlain(obj) {
    return new Turn(obj.words, obj.bingo)
  }

  isEmpty() {
    return this.words.length === 0;
  }

  isPassed(game) {
    return this.isEmpty() && this !== game.getCurrentTurn();
  }

  isComplete(game) {
    return this !== game.getCurrentTurn()
  }

  get score() {
    let result = 0;
    for (let i = 0; i < this.words.length; i++) {
      result += this.words[i].score;
    }

    if (this.bingo) {
      result += 50;
    }

    return result;
  }
}

export default class Game {
  constructor(playersTurns, currentPlayerIndex, leftOversTurnNumber) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.playersTurns = playersTurns;
    this.leftOversTurnNumber = leftOversTurnNumber;
  }

  static createNewGame(numberOfPlayers) {
    const turn = Turn.empty();
    const playersTurns = resizeArray([[turn]], numberOfPlayers, []);
    return new Game(playersTurns, 0, null);
  }

  static fromPlain(obj) {
    const turns = obj.playersTurns.map(player => player.map(turn => Turn.fromPlain(turn)));
    return new Game(turns, obj.currentPlayerIndex, obj.leftOversTurnNumber);
  }

  addWord(word) {
    const currentTurn = this.getCurrentTurn();
    const turn = new Turn([...currentTurn.words, word], currentTurn.bingo);
    return this._setTurn(this.currentPlayerIndex, this.getCurrentTurnNumber(), turn);
  }

  endTurn() {
    let newGame = this;
    if (this.getCurrentTurn().isEmpty()) {
      newGame = this._setTurn(this.currentPlayerIndex, this.getCurrentTurnNumber(), Turn.empty());
    }
    const newPlayerIndex = (this.currentPlayerIndex + 1) % this.playersTurns.length;
    const players = newGame.playersTurns.map((history, playerIndex) => (playerIndex === newPlayerIndex ? [...history, Turn.empty()] : history));
    return new Game(players, newPlayerIndex, this.leftOversTurnNumber);
  }

  setBingo(value) {
    const turn = new Turn(this.getCurrentTurn().words, value);
    return this._setTurn(this.currentPlayerIndex, this.getCurrentTurnNumber(), turn);
  }

  endGame() {
    return new Game(this.playersTurns, this.currentPlayerIndex, this.getCurrentTurnNumber());
  }

  isGameOver() {
    return this.leftOversTurnNumber !== null;
  }

  areLeftOversSubmitted() {
    if (this.isGameOver() && this.playersTurns[this.playersTurns.length - 1][this.leftOversTurnNumber] && this.currentPlayerIndex === 0) {
      return true;
    }
    return false;
  }

  isMoveInGameOver(move) {
    return this.isGameOver() && move >= this.leftOversTurnNumber;
  }

  getReapers() {
    const reaperIndexes = [];
    for (let i = 0; i < this.playersTurns.length; i++) {
      if (this.playersTurns[i][this.leftOversTurnNumber].isEmpty()) {
        reaperIndexes.push(i);
      }
    }
    return reaperIndexes;
  }

  getSumOfLeftovers() {
    let total = 0;
    for (let i = 0; i < this.playersTurns.length; i++) {
      total += Math.abs(this.playersTurns[i][this.leftOversTurnNumber].score);
    }
    return total;
  }

  distributeLeftOversToReapers(reapers, totalLeftOverScore) {
    let game = this;
    reapers.forEach((reaperIndex) => {
      const turn = new Turn([{ value: '__reaped_leftovers__', modifiers: [], score: totalLeftOverScore}], false);
      game = game._setTurn(reaperIndex, this.leftOversTurnNumber, turn);
    });
    return game;
  }

  getWinners(upToMove) {
    const totalScores = this.playersTurns.map((_, i) => this.getTotalScore(i, upToMove));
    return indexesOf(totalScores, Math.max(...totalScores));
  }

  _setTurn(playerIndex, turnNumber, turn) {
    const playerCopy = this.playersTurns[playerIndex].slice();
    playerCopy[turnNumber] = turn;
    const newPlayers = this.playersTurns.map((player, i) => (i === playerIndex ? playerCopy : player));
    return new Game(newPlayers, this.currentPlayerIndex, this.leftOversTurnNumber);
  }

  getLastPlayer() {
    return this.playersTurns[(this.playersTurns.length + this.currentPlayerIndex - 1) % this.playersTurns.length];
  }

  getCurrentPlayer() {
    return this.playersTurns[this.currentPlayerIndex];
  }

  getLastTurn() {
    return this.getLastPlayer().slice(-1)[0];
  }

  getCurrentTurn() {
    return this.getCurrentPlayer().slice(-1)[0];
  }

  getCurrentTurnNumber() {
    return this.playersTurns[0].length - 1;
  }

  getCurrentPlayerIndex() {
    return this.currentPlayerIndex;
  }

  getLastWord() {
    const currentTurn = this.getCurrentTurn();
    if (!currentTurn.isEmpty()) {
      return currentTurn.words.slice(-1)[0];
    }
    const lastTurn = this.getLastTurn();
    return lastTurn.words.slice(-1)[0];
  }

  getRunningTotals(playerIndex) {
    const player = this.playersTurns[playerIndex];
    let result = [];
    let totalScore = 0;
    for (let i = 0; i < player.length; i++) {
      totalScore += player[i].score
      result.push(totalScore);
    }
    return result;
  }
  
  getTotalScore(playerIndex, upToMove) {
    let totals = this.getRunningTotals(playerIndex);
    if (upToMove !== undefined)
      return totals[upToMove];
    return totals.length === 0 ? 0 : totals[totals.length - 1];
  }
}
