const Nightmare = require('nightmare')

describe('GameSetting', () => {
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