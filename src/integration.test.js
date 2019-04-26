import React from 'react'
import {mount, shallow} from 'enzyme'
import ScrabbleScoreKeeper from './ScrabbleScoreKeeper.js';

const Nightmare = require('nightmare')

/* skip because this test needs the dev server launched */
describe.skip('Nightmare tests', () => {
	it('selects players', (done) => {
		const nightmare = Nightmare()
		nightmare
			.goto('http://localhost:3000')
			.type('#player-name-input-0', 'Anna')
			.type('#player-name-input-1', 'Nico')
			.click('button')
			.wait('.scrabble-input-box')
			.click('.scrabble-input-box')
			.type('body', 'rose')
			.evaluate(() => document.querySelector(".scrabble-input-box").textContent)
			.end()
		    .then(textContent => {
		    	expect(textContent.toLowerCase().replace(/[0-9]/g, '')).toEqual('rose')
		    	done()
		    })
	})
	it("blinker appears, when we click on Scrabble Input Box and disappears when we click outside the Scrabble Input Box", () => {
		const nightmare = Nightmare()
		nightmare
			.goto('http://localhost:3000')
			.type('#player-name-input-0', 'Anna')
			.type('#player-name-input-1', 'Nico')
			.click('button')
			.wait('.scrabble-input-box')
			.exists('.blinker')
			.then(function(blinker) {
				if (!blinker) return nightmare.goto('http://localhost:3000')
																			.type('#player-name-input-0', 'Anna')
																			.type('#player-name-input-1', 'Nico')
																			.click('button')
																			.wait('.scrabble-input-box')
																			.click('.scrabble-input-box')
																			.exists('.blinker')
			})
			.then(function(blinker) {
				if (blinker) return nightmare.goto('http://localhost:3000')
																			.type('#player-name-input-0', 'Anna')
																			.type('#player-name-input-1', 'Nico')
																			.click('button')
																			.wait('.scrabble-input-box')
																			.click('.scrabble-input-box')
																			.exists('.blinker')
																			.click('body')
																			.exists('.blinker')
			})
			.then(function(result) {
				if (!result) return "Blinker disappeared!"

			})
	})
})

describe('Game', () => {

	function fillPlayers(wrapper, numOfPlayers) {
		const players = ["Anna", "Nico", "Kyle", "Sofi"]
		wrapper.find('#number-of-players-select').simulate('change', {target: {value: numOfPlayers}})
		for (let i = 0; i < numOfPlayers; i++) {
			wrapper.find('#player-name-input-' + i).simulate('change', {target: {value: players[i]}})
		}

		wrapper.find('button').simulate('click')
	}

	const typeInputBox = (wrapper, input) => wrapper.find('.scrabble-input-box input').simulate('change', {target: {value: input}})
	const clickButton = (wrapper, regex) => wrapper.find('button').filterWhere(n => n.text().match(regex)).simulate('click')
	const clickAddWord = wrapper => clickButton(wrapper, /add.*word/i)
	const clickUndo = wrapper => clickButton(wrapper, /undo/i)
	const clickEndTurn = wrapper => clickButton(wrapper, /end turn/i)
	const clickPass = wrapper => clickButton(wrapper, /pass/i)
	const clickEndGame = wrapper => clickButton(wrapper, /end.*game/i)
	const clickSubmitLeftovers = wrapper => clickButton(wrapper, /submit.*leftovers/i)
	const clickBingo = wrapper => wrapper.find('#bingoToggle').simulate('change')
	const clickLetterModifier = (wrapper, letterIndex, modifier) => {
		wrapper.find('WithModifierPopover').at(letterIndex).find('Tooltip').prop('onVisibilityChange')(true)
		wrapper.update()
		wrapper.find('WithModifierPopover').at(letterIndex).find('Tooltip').find('.modifier.' + modifier).simulate('click')
	}
	const clickUndoMultipleTimes = (wrapper, numTimes) => {
		for ( let i = 0; i < numTimes; i++) {
			clickUndo(wrapper)
		}
	}
	const getCurrentPlayer = wrapper => {
		return wrapper.find('.bold').text()
	}
	const getCurrentWordScore = wrapper => {
		return wrapper.find('CurrentScore').find('div#score').text()
	}
	const getMoveNumber = (grid, moveIndex) => { 
		return grid.find("tbody tr.move-row").at(moveIndex).find('th').text()
	}
	const getTotal = grid => {
		return grid.find('ScoreGrid').find('tr.total-score').find('th').text()
	}
	const getTotalCell = (grid, playerIndex) => {
		return grid.find('ScoreGrid').find('tr.total-score').find('td').at(playerIndex).text()
	} 
	const getScoreGridCell = (grid, moveIndex, playerIndex) => {
		return grid.find("tbody tr.move-row").at(moveIndex).find("ScoreGridCell").at(playerIndex)
	}
	const getWordAt = (grid, moveIndex, playerIndex, wordIndex) => {
		return getScoreGridCell(grid, moveIndex, playerIndex).find("WordInTiles").at(wordIndex).props().word.value
	}
	const getWinner = wrapper => {
		return wrapper.find('.winner').find('h1').text()
	}
	const getLetterModifier = (wrapper, letterIndex, modifier)  => {
		return wrapper.find('WithModifierPopover').at(letterIndex).find('.scrabble-letter').hasClass(modifier)
	}
	const getTile = (wrapper, letterIndex) => {
		return wrapper.find('ScrabbleInputBox').find('ScrabbleTile').at(letterIndex)
	}
	const checkLetterTiles = (wrapper, letterTiles) => {
		letterTiles.forEach(function(tile, i) {
			expect(getTile(wrapper, i)).toHaveText(tile)
		})
	}

	/*.tap(n => console.log(n.debug()))*/



	it('fills Players', () => {
		const wrapper = mount(<ScrabbleScoreKeeper />)
		fillPlayers(wrapper, 4)
		
		expect(wrapper.find('th.player-header').length).toEqual(4)
		expect(wrapper.find('th.player-header').at(0).text()).toEqual('Anna')
		expect(wrapper.find('th.player-header').at(1).text()).toEqual('Nico')
		expect(wrapper.find('th.player-header').at(2).text()).toEqual('Kyle')
		expect(wrapper.find('th.player-header').at(3).text()).toEqual('Sofi')
	})

	it('types inside the scrabble input box', () => {
		const wrapper = mount(<ScrabbleScoreKeeper />)
		fillPlayers(wrapper, 3)
		typeInputBox(wrapper, 'quizzify')
		checkLetterTiles(wrapper, ["Q10", "U1", "I1", "Z10", "Z10", "I1", "F4", "Y4"])
	})

	it("case insensitive and doesn't allow any characters except letters inside Scrabble Input Box", () => {
		const wrapper = mount(<ScrabbleScoreKeeper />)
		fillPlayers(wrapper, 3)
		typeInputBox(wrapper, '!1q uetzAls=')
		checkLetterTiles(wrapper, ["Q10", "U1", "E1", "T1", "Z10", "A1", "L1", "S1"])
	})

	it(`In game controls: addWord, endTurn, PASS, toggleBingo, endGame --- work properly;
		scoreGrid: move number, submitted words, total --- display correctly;
		currentPlayer: currnet player name/inGame & inGameOver sentence changes correctly;
		currentWordScore: display score for current word;
		unlimited undoes;`, () => {
		const wrapper = mount(<ScrabbleScoreKeeper />)
		fillPlayers(wrapper, 4)
		typeInputBox(wrapper, 'aalii') //p0: 5
		clickAddWord(wrapper)
		typeInputBox(wrapper, 'ouguiya') //p0: 16
		clickAddWord(wrapper)
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'jota') // p1: 11
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'kex') //p2: 14
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'ziti') //p3: 13
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'knickknack') // p0: 46
		clickAddWord(wrapper)
		clickBingo(wrapper)
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'pizza') //p1: 36
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'oorie') //p2: 19
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'ourie') //p3: 18               
		clickEndTurn(wrapper)
		clickPass(wrapper) //p0: 91 PASS
		typeInputBox(wrapper, 'za') //p1: 47
		clickAddWord(wrapper)
		typeInputBox(wrapper, 'muzjiks') //p1: 76
		clickAddWord(wrapper)
		typeInputBox(wrapper, 'aerie') //p1: 81
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'caziques') //p2: 47
		clickAddWord(wrapper)
		typeInputBox(wrapper, 'faqir') //p2: 64
		clickAddWord(wrapper)
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'jousted') //p3:33
		clickAddWord(wrapper)
		typeInputBox(wrapper, 'quixotry') //p3: 60
		clickAddWord(wrapper)
		typeInputBox(wrapper, 'jukebox') // p3: 89
		clickEndTurn(wrapper)

		const grid = wrapper.find('ScoreGrid')

		
//                   move, player, word
		expect(getMoveNumber(grid, 0)).toEqual('1')
		expect(getWordAt(grid, 0, 0, 0)).toEqual('aalii')
		expect(getWordAt(grid, 0, 0, 1)).toEqual('ouguiya')
		expect(getWordAt(grid, 0, 1, 0)).toEqual('jota')
		expect(getWordAt(grid, 0, 2, 0)).toEqual('kex')
		expect(getWordAt(grid, 0, 3, 0)).toEqual('ziti')
		expect(getMoveNumber(grid, 1)).toEqual('2')
		expect(getWordAt(grid, 1, 0, 0)).toEqual('knickknack')
		expect(getScoreGridCell(grid, 1, 0).find("tr").at(1).text()).toMatch(/BINGO/)
		expect(getWordAt(grid, 1, 1, 0)).toEqual('pizza')
		expect(getWordAt(grid, 1, 2, 0)).toEqual('oorie')
		expect(getWordAt(grid, 1, 3, 0)).toEqual('ourie')
		expect(getMoveNumber(grid, 2)).toEqual('3')
		expect(getCurrentPlayer(wrapper)).toEqual('Anna, submit a word:')
		expect(getTotalCell(grid, 0)).toEqual('96')
		expect(getTotalCell(grid, 1)).toEqual('81')
		expect(getTotalCell(grid, 2)).toEqual('64')
		expect(getTotalCell(grid, 3)).toEqual('87')
		expect(getCurrentWordScore(wrapper)).toEqual('Score is 0')
		typeInputBox(wrapper, 'jukebox')
		expect(getCurrentWordScore(wrapper)).toEqual('Score is 27')
		clickEndGame(wrapper)
		expect(getCurrentPlayer(wrapper)).toEqual('Anna, submit your leftovers:')
		expect(getCurrentWordScore(wrapper)).toEqual('Score is 0')
		typeInputBox(wrapper, 'lii')
		expect(getCurrentWordScore(wrapper)).toEqual('Score is -3')
		clickSubmitLeftovers(wrapper)
		expect(getCurrentPlayer(wrapper)).toEqual('Nico, submit your leftovers:')
		typeInputBox(wrapper, 'd')
		clickSubmitLeftovers(wrapper)
		expect(getTotalCell(grid, 1)).toEqual('79')
		typeInputBox(wrapper, 'a')
		clickSubmitLeftovers(wrapper)
		expect(getCurrentPlayer(wrapper)).toEqual('Sofi, submit your leftovers:')
		clickSubmitLeftovers(wrapper)
		expect(getTotalCell(grid, 0)).toEqual('93')
		expect(getTotalCell(grid, 1)).toEqual('79')
		expect(getTotalCell(grid, 2)).toEqual('63')
		expect(getTotalCell(grid, 3)).toEqual('93')
		expect(getWinner(wrapper)).toEqual("Anna WON")
		clickUndo(wrapper)
		typeInputBox(wrapper, 'f')
		expect(getCurrentWordScore(wrapper)).toEqual('Score is -4')
		clickSubmitLeftovers(wrapper)
		expect(getWinner(wrapper)).toEqual("Anna WON")
		clickUndoMultipleTimes(wrapper, 4)
		
		typeInputBox(wrapper, 'zax')
		expect(getCurrentWordScore(wrapper)).toEqual('Score is -19')
		clickSubmitLeftovers(wrapper)
		typeInputBox(wrapper, 'd')
		clickSubmitLeftovers(wrapper)
		typeInputBox(wrapper, 'a')
		clickSubmitLeftovers(wrapper)
		clickSubmitLeftovers(wrapper)
		expect(getWinner(wrapper)).toEqual("Sofi WON")
		expect(getTotalCell(grid, 3)).toEqual('109')
		clickUndoMultipleTimes(wrapper, 5)
		clickPass(wrapper)
		typeInputBox(wrapper, 'backers')
		clickEndTurn(wrapper)
		typeInputBox(wrapper, 'queue')
		clickEndTurn(wrapper)
		clickPass(wrapper)
		clickEndGame(wrapper)
		typeInputBox(wrapper, 'a')
		clickSubmitLeftovers(wrapper)
		typeInputBox(wrapper, 'a')
		clickSubmitLeftovers(wrapper)
		clickSubmitLeftovers(wrapper)
		clickSubmitLeftovers(wrapper)
		expect(getWinner(wrapper)).toEqual("Tie game: Anna: 96Nico: 96")
		clickUndoMultipleTimes(wrapper, 31)
		expect(getTotalCell(grid, 0)).toEqual('0')
		expect(getTotalCell(grid, 1)).toEqual('0')
		expect(getTotalCell(grid, 2)).toEqual('0')
		expect(getTotalCell(grid, 3)).toEqual('0')
		expect(getTotal(grid)).toEqual('TOTAL')
	})

	it(`modifier toolpit works;
			adds modifiers tooltip to the tiles in the InputBox and alters the score;
			adds modifiers tooltip to the tiles in the TableCells;`, () => {
			const wrapper = mount(<ScrabbleScoreKeeper />)
			fillPlayers(wrapper, 2)
			typeInputBox(wrapper, 'reapers') //p0: 8
			clickLetterModifier(wrapper, 3, 'triple-word')
			expect(getLetterModifier(wrapper, 3, 'triple-word')).toEqual(true)
			clickLetterModifier(wrapper, 6, 'double-letter')
			expect(getLetterModifier(wrapper, 3, 'triple-word')).toEqual(true)
			clickLetterModifier(wrapper, 0, 'triple-letter')
			expect(getLetterModifier(wrapper, 0, 'triple-letter')).toEqual(true)
			clickLetterModifier(wrapper, 2, 'double-word')
			expect(getLetterModifier(wrapper, 2, 'double-word')).toEqual(true)
			clickLetterModifier(wrapper, 5, 'blank')
			expect(getLetterModifier(wrapper, 5, 'blank')).toEqual(true)
			clickLetterModifier(wrapper, 5, 'blank')
			expect(getLetterModifier(wrapper, 5, 'blank')).toEqual(false)
	})
}) 