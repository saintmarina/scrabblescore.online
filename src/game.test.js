import Game from './game.js';

const w1 = {value:'rose', modifiers: [null, null, null, null], score: 4}
const w2 = {value:'time', modifiers: [null, null, null, null], score: 4}
const w3 = {value:'lost', modifiers: [null, null, null, null], score: 4}

test('Game can be created with some number of players', () => {
	let game = Game.createNewGame(3);
  	expect(game.players.length).toBe(3);
});

test('Game is adding words for current player', () => {
	let game = Game.createNewGame(3);
	expect(game.players[0].length).toEqual(1)
	expect(game.players[0][0].words).toEqual([])
	game = game.addWord(w1);
	expect(game.players[0].length).toEqual(1)
	expect(game.players[0][0].words).toEqual([w1])
	game = game.addWord(w2);
	expect(game.players[0].length).toEqual(1)
	expect(game.players[0][0].words).toEqual([w1, w2])
	game = game.endTurn();
	game = game.addWord(w3);
	expect(game.players[0][0].words).toEqual([w1, w2])
	expect(game.players[1][0].words).toEqual([w3])
});

test('endTurn() changes player and turn number, and create an empty turn for the next player', () => {
	let numPlayers = 3;
	let game = Game.createNewGame(numPlayers);

	for (let i = 0; i < 10; i++) {
		expect(game.getCurrentPlayerIndex()).toEqual(i % numPlayers);
		expect(game.getCurrentTurnNumber()).toEqual(Math.floor(i / numPlayers));
		expect(game.players[game.getCurrentPlayerIndex()][game.getCurrentTurnNumber()].words).toEqual([]);
		game = game.endTurn();
	}
});

test('game should be immutable', () => {
	let game = Game.createNewGame(2);

	game.addWord(w1);
	game.endTurn().addWord(w1);
	game.setBingo(true);
	expect(game.players[0].length).toEqual(1)
	expect(game.players[0][0].words).toEqual([])
	expect(game.players[0][0].bingo).toEqual(false)
	expect(game.players[1].length).toEqual(0)
});

test('test setBingo()', () => {
	let game = Game.createNewGame(2);
	game = game.setBingo(true);
	expect(game.players[0][0].bingo).toBe(true)
});