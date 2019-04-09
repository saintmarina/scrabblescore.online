import React from 'react'
import {mount, shallow} from 'enzyme'
import ScrabbleScoreKeeper from './ScrabbleScoreKeeper.js';

const Nightmare = require('nightmare')

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
})

describe('Game',() => {
	it('works', () => {
		const wrapper = mount(<ScrabbleScoreKeeper />)
		wrapper.find('#player-name-input-0').simulate('change', {target: {value: 'Anna'}})
		wrapper.find('#player-name-input-1').simulate('change', {target: {value: 'Nico'}})
		wrapper.find('button').simulate('click')

		expect(wrapper.find('th.player-header').length).toEqual(2)
		expect(wrapper.find('th.player-header').at(0).text()).toEqual('Anna')
		expect(wrapper.find('th.player-header').at(1).text()).toEqual('Nico')

		const typeInputBox = input => wrapper.find('.scrabble-input-box input').simulate('change', {target: {value: input}})
		const clickButton = regex => wrapper.find('button').filterWhere(n => n.text().match(regex)).simulate('click')
		const clickAddWord = () => clickButton(/add.*word/i)
		const clickUndo = () => clickButton(/undo/i)
		const clickEndTurn = () => clickButton(/end turn/i)
		const clickBingo = () => wrapper.find('#bingoToggle').simulate('change')

		// Move 0, Player 0: rose, honey
		typeInputBox("rose")
		clickAddWord()
		typeInputBox("honey")
		clickAddWord()
		clickEndTurn()
		// Move 0, Player 1: coconut
		typeInputBox("coconut")
		clickEndTurn()
		// Move 1, Player 0: lemon, BINGO
		typeInputBox("lemon")
		clickBingo()
		clickEndTurn()
		// Move 1, Player 1: PASS
		clickEndTurn()


		const grid = wrapper.find('ScoreGrid')

		///console.log("things", grid.find("WordInTiles").debug())

		const getScoreGridCell = (moveIndex, playerIndex) => {
			return grid.find("tbody tr.move-row").at(moveIndex).find("ScoreGridCell").at(playerIndex)
		}
		const getWordAt = (moveIndex, playerIndex, wordIndex) => {
			return getScoreGridCell(moveIndex, playerIndex).find("WordInTiles").at(wordIndex).props().word.value
		}

		expect(getWordAt(0, 0, 0)).toEqual("rose")
		expect(getWordAt(0, 0, 1)).toEqual("honey")

		expect(getWordAt(0, 1, 0)).toEqual("coconut")

		expect(getWordAt(1, 0, 0)).toEqual("lemon")
		expect(getScoreGridCell(1, 0).find("tr").at(1).text()).toMatch(/BINGO/)

		expect(getScoreGridCell(1, 1)).toHaveText("PASS")
	})
})