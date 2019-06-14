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

  isEmpty() {
    return this.words.length === 0;
  }

  isPassed(game) {
    return this.isEmpty() && this !== game.getCurrentTurn();
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
  constructor(players, currentPlayerIndex, leftOversTurnNumber) {
    this.currentPlayerIndex = currentPlayerIndex;
    this.playersTurns = players;
    this.leftOversTurnNumber = leftOversTurnNumber;
  }

  static createNewGame(numberOfPlayers) {
    const turn = Turn.empty();
    const players = resizeArray([[turn]], numberOfPlayers, []);
    return new Game(players, 0, null);
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
    const players = this.isGameOver() && (this.getCurrentPlayer() === this.playersTurns[this.playersTurns.length - 1]) ? newGame.playersTurns
      : newGame.playersTurns.map((history, playerIndex) => (playerIndex === newPlayerIndex ? [...history, Turn.empty()] : history));
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
      const turn = new Turn([{ value: '', modifiers: [], score: totalLeftOverScore }], false);
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

  getCurrentPlayer() {
    return this.playersTurns[this.currentPlayerIndex];
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
