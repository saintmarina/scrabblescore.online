import Game from './game';

const w1 = { value: 'rose', modifiers: [null, null, null, null], score: 8 };
const w2 = { value: 'time', modifiers: [null, null, null, null], score: 10 };
const w3 = { value: 'lost', modifiers: [null, null, null, null], score: 1 };
const w4 = { value: 'lost', modifiers: [null, null, null, null], score: 7 };
const w1A = { value: 'rose', modifiers: [null, null, null, null], score: -1 };
const w2A = { value: 'time', modifiers: [null, null, null, null], score: -1 };

test('Game can be created with some number of players', () => {
  const game = Game.createNewGame(3);
  	expect(game.players.length).toBe(3);
});

test('Game is adding words for current player', () => {
  let game = Game.createNewGame(3);
  expect(game.players[0].length).toEqual(1);
  expect(game.players[0][0].words).toEqual([]);
  game = game.addWord(w1);
  expect(game.players[0].length).toEqual(1);
  expect(game.players[0][0].words).toEqual([w1]);
  game = game.addWord(w2);
  expect(game.players[0].length).toEqual(1);
  expect(game.players[0][0].words).toEqual([w1, w2]);
  game = game.endTurn();
  game = game.addWord(w3);
  expect(game.players[0][0].words).toEqual([w1, w2]);
  expect(game.players[1][0].words).toEqual([w3]);
});

test('endTurn() changes player and turn number, and create an empty turn for the next player', () => {
  const numPlayers = 3;
  let game = Game.createNewGame(numPlayers);

  for (let i = 0; i < 10; i++) {
    expect(game.getCurrentPlayerIndex()).toEqual(i % numPlayers);
    expect(game.getCurrentTurnNumber()).toEqual(Math.floor(i / numPlayers));
    expect(game.players[game.getCurrentPlayerIndex()][game.getCurrentTurnNumber()].words).toEqual([]);
    game = game.endTurn();
  }
});

test('game should be immutable', () => {
  const game = Game.createNewGame(2);
  game.addWord(w1);
  game.endTurn().addWord(w1);
  game.setBingo(true);
  expect(game.players[0].length).toEqual(1);
  expect(game.players[0][0].words).toEqual([]);
  expect(game.players[0][0].bingo).toEqual(false);
  expect(game.players[1].length).toEqual(0);
});

test('test setBingo()', () => {
  let game = Game.createNewGame(2);
  game = game.addWord(w1);
  expect(game.players[0][0].words).toEqual([w1]);
  game = game.setBingo(false);
  expect(game.players[0][0].bingo).toBe(false);
  game = game.setBingo(true);
  expect(game.players[0][0].bingo).toBe(true);
  game = game.addWord(w1);
  expect(game.players[0][0].words).toEqual([w1, w1]);
  expect(game.players[0][0].bingo).toBe(true);
});

test('get score of the Turn', () => {
  let game = Game.createNewGame(2);
  expect(game.players[0][0].score).toEqual(0);
  game = game.addWord(w1);
  game = game.addWord(w2);
  expect(game.players[0][0].score).toEqual(18);
  game = game.setBingo(true);
  expect(game.players[0][0].score).toEqual(68);
  game = game.endTurn();
  expect(game.players[0][0].score).toEqual(68);
  expect(game.players[1][0].score).toEqual(0);
  game = game.addWord(w3);
  expect(game.players[0][0].score).toEqual(68);
  expect(game.players[1][0].score).toEqual(1);
});


test('getTotalScore() without last turn', () => {
  let game = Game.createNewGame(3);
  game = game.addWord(w4).endTurn(); // p0:7
  game = game.addWord(w4).endTurn(); // p1:7
  game = game.addWord(w4).endTurn(); // p2:7
  game = game.addWord(w4).endTurn(); // p0: 14
  game = game.endTurn();							// p1:7
  game = game.endTurn(); 						// p2:7
  game = game.addWord(w1).endTurn(); // p0: 22
  game = game.addWord(w2).endTurn();// p1: 17
  game = game.addWord(w3).endTurn();// p2: 8
  game = game.endGame();
  game = game.endTurn(); 						 // p0:22 + 2
  game = game.addWord(w1A).endTurn(); // p1: 16
  game = game.addWord(w1A).endTurn(); // 7
  game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers());
  expect(game.getTotalScore(0)).toEqual(24);
  expect(game.getTotalScore(0, false)).toEqual(22);
  expect(game.getTotalScore(1)).toEqual(16);
  expect(game.getTotalScore(1, false)).toEqual(17);
  expect(game.getTotalScore(2)).toEqual(7);
  expect(game.getTotalScore(2, false)).toEqual(8);
});

test('getCurrentTurn() is getting turn of the current player', () => {
  let game = Game.createNewGame(2);
  game = game.addWord(w1);
  game = game.endTurn().addWord(w2);
  expect(game.getCurrentTurn().words).toEqual([w2]);
});

test('gerCurrentPlayer() is getting an array of turns of current player', () => {
  let game = Game.createNewGame(2);
  game = game.addWord(w1).endTurn();
  game = game.addWord(w2).endTurn();
  game = game.addWord(w2).endTurn();
  game = game.addWord(w1).endTurn();
  expect(game.getCurrentPlayer()).toEqual([{"bingo": false, "words": [{"modifiers": [null, null, null, null], "score": 8, "value": "rose"}]}, {"bingo": false, "words": [{"modifiers": [null, null, null, null], "score": 10, "value": "time"}]}, {"bingo": false, "words": []}]); });

test('endTurn() on an empty word ands just an empty array', () => {
  let game = Game.createNewGame(2);
  game = game.endTurn();
  game = game.addWord(w1).endTurn();
  expect(game.players[0][0].words).toEqual([]);
});

test('setBingo() sets the bingo turn value', () => {
  let game = Game.createNewGame(2);
  game = game.setBingo(true);
  expect(game.getCurrentTurn().bingo).toEqual(true);
  game = game.setBingo(false);
  expect(game.getCurrentTurn().bingo).toEqual(false);
});
test('endGame() sets this.gameOver to true', () => {
  let game = Game.createNewGame(2);
  game = game.addWord(w1).endTurn();
  game = game.addWord(w2).endTurn();
  game = game.endGame();
  expect(game.leftOversTurnNumber).toEqual(1);
  expect(game.isGameOver()).toEqual(true);
});

test('isLeftOversComplete', () => {
  function isLeftOversComplete(players, lastMoveIndex) {
    let result = 0;
    for (let i = 0; i < players.length; i++) {
	    if (players[i][lastMoveIndex]) {
        result += 1;
	    }
    }
    return result === players.length;
  }
  let game = Game.createNewGame(2);
  game = game.addWord(w1).endTurn();
  game = game.addWord(w2).endTurn();
  game = game.addWord(w2).endTurn();
  game = game.addWord(w1).endTurn();
  expect(isLeftOversComplete(game.players, 1)).toEqual(true);
});
test('areLeftOversSubmitted', () => {
  let game = Game.createNewGame(2);
  game = game.addWord(w1).endTurn();
  game = game.addWord(w2).endTurn();
  game = game.endGame();
  game = game.addWord(w2).endTurn();
  game = game.addWord(w1).endTurn();
  expect(game.areLeftOversSubmitted()).toEqual(true);
});

test('getReapers()', () => {
  let game = Game.createNewGame(3);
  // All players submitted one word:
  game = game.addWord(w1).endTurn();// Player 0, score 8
  game = game.addWord(w2).endTurn();// Player 1, score 10
  game = game.addWord(w3).endTurn();// Player 2, score 1
  // Game ends, player 0 has no leftovers:
  game = game.endGame();
  game = game.endTurn(); // Player 0, score 8 + 1 (9)
  game = game.endTurn();// Player 1, score 10 + 1 (11)
  game = game.addWord(w2A).endTurn();// Player 2, score 1 - 1 (0)
  expect(game.getReapers()).toEqual([0, 1]);
});

test('getSumOfLeftovers()', () => {
  let game = Game.createNewGame(3);
  // All players submitted one word:
  game = game.addWord(w1).endTurn();// 8
  game = game.addWord(w2).endTurn();// 10
  game = game.addWord(w3).endTurn();// 1
  // Game ends, player 0 has no leftovers:
  game = game.endGame();
  game = game.endTurn();
  game = game.addWord(w1A).endTurn();// -1
  game = game.addWord(w2A).endTurn();// -1
  expect(game.getSumOfLeftovers()).toEqual(2);
});

test('distributeLeftOversToReapers', () => {
  let game = Game.createNewGame(3);
  // All players submitted one word:
  game = game.addWord(w1).endTurn();// Player 0, score 8
  game = game.addWord(w2).endTurn();// Player 1, score 10
  game = game.addWord(w3).endTurn();// Player 2, score 1
  // Game ends, player 0 has no leftovers:
  game = game.endGame();
  game = game.endTurn(); // Player 0, score 8 + 1 (9)
  game = game.endTurn();						 // Player 1, score 10 + 1 (11)
  game = game.addWord(w2A).endTurn();// Player 2, score 1 - 1 (0)
  game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers());
  expect(game.players[0][1].words[0].score).toEqual(1);
  expect(game.players[1][1].words[0].score).toEqual(1);
  expect(game.getTotalScore(0)).toEqual(9);
  expect(game.getTotalScore(1)).toEqual(11);
});

test('getWinners() when tie of 3 players', () => {
  let game = Game.createNewGame(3);
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.endGame();
  game = game.endTurn();
  game = game.endTurn();
  game = game.endTurn();
  game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers());
  expect(game.isGameOver()).toEqual(true);
  expect(game.areLeftOversSubmitted()).toEqual(true);
  expect(game.getWinners()).toEqual([0, 1, 2]);
});

test('getWinners() when tie of 4 players', () => {
  let game = Game.createNewGame(4);
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.endGame();
  game = game.endTurn();
  game = game.endTurn();
  game = game.endTurn();
  game = game.endTurn();
  game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers());
  expect(game.isGameOver()).toEqual(true);
  expect(game.areLeftOversSubmitted()).toEqual(true);
  expect(game.getWinners()).toEqual([0, 1, 2, 3]);
});

test('getWinners() when tie of two players', () => {
  let game = Game.createNewGame(3);
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.endGame();
  game = game.endTurn(); // 8
  game = game.endTurn();// 8
  game = game.addWord(w1A).endTurn(); // 6
  game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers());
  expect(game.isGameOver()).toEqual(true);
  expect(game.areLeftOversSubmitted()).toEqual(true);
  expect(game.getWinners()).toEqual([0, 1]);
});

test('getWinners() one winner', () => {
  let game = Game.createNewGame(3);
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.addWord(w4).endTurn(); // 7
  game = game.endGame();
  game = game.endTurn(); // 8
  game = game.addWord(w1A).addWord(w1A).endTurn();// 5
  game = game.addWord(w1A).endTurn(); // 6
  game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers());
  expect(game.getWinners()).toEqual([0]);
});
