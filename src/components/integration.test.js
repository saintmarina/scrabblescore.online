/* eslint-disable */

import React from 'react';
import { mount, shallow } from 'enzyme';
import ScrabbleScoreKeeper from './ScrabbleScoreKeeper/ScrabbleScoreKeeper';

const Nightmare = require('nightmare');

Nightmare.action('realClick', (name, options, parent, win, renderer, done) => {
  parent.respondTo('realClick', (x, y, done) => {
    win.webContents.sendInputEvent({
      type: 'mousedown',
      x,
      y,
      clickCount: 1,
    });
    win.webContents.sendInputEvent({
      type: 'mouseup',
      x,
      y,
    });
    setTimeout(() => { done(); }, 50);
  });
  done();
}, function (selector, done) {
  const { child } = this;
  this.evaluate_now((selector) => {
    const bounds = document.querySelector(selector).getBoundingClientRect();
    return {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    };
  }, (error, bounds) => {
    if (error) return done(error);
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    child.call('realClick', x, y, done);
  }, selector);
});

/* skip because this test needs the dev server launched */
describe.skip('Nightmare tests', () => {
  it('selects players', async () => {
    const nightmare = Nightmare();
    nightmare
      .goto('http://localhost:3000')
      .type('#player-name-input-0', 'Anna')
      .type('#player-name-input-1', 'Nico')
      .click('button')
      .wait('.scrabble-input-box')
      .click('.scrabble-input-box')
      .type('body', 'rose');

    const textContent = await nightmare.evaluate(() => document.querySelector('.scrabble-input-box').textContent);
    expect(textContent.toLowerCase().replace(/[0-9]/g, '')).toEqual('rose');

    nightmare.end();
  });

  it('blinker appears, when we click on Scrabble Input Box and disappears when we click outside the Scrabble Input Box', async () => {
    const nightmare = Nightmare();
    nightmare
      .goto('http://localhost:3000')
      .type('#player-name-input-0', 'Anna')
      .type('#player-name-input-1', 'Nico')
      .click('button')
      .wait('.scrabble-input-box');

    expect(await nightmare.exists('.blinker')).toBe(true);
    nightmare.realClick('h1');
    expect(await nightmare.exists('.blinker')).toBe(false);
    nightmare.click('.scrabble-input-box');
    expect(await nightmare.exists('.blinker')).toBe(true);

    nightmare.end();
  });
});

describe('Game', () => {
  function fillPlayers(wrapper, numOfPlayers) {
    const players = ['Anna', 'Nico', 'Kyle', 'Sofi'];
    for (let i = 0; i < numOfPlayers; i++) {
      wrapper.find(`#player-name-input-${i}`).simulate('change', { target: { value: players[i] } });
    }

    wrapper.find('button').simulate('click');
  }

  function chooseLanguage(wrapper, language) {
    wrapper.find('#language-select').simulate('change', { target: { value: language } });
  }

  const typeInputBox = (wrapper, input) => wrapper.find('.scrabble-input-box input').simulate('change', { target: { value: input } });
  const clickButton = (wrapper, regex) => wrapper.find('.btn').filterWhere(n => n.text().match(regex)).simulate('click');
  const clickAddWord = wrapper => clickButton(wrapper, /add.*word/i);
  const clickUndo = wrapper => clickButton(wrapper, /undo/i);
  const clickEndTurn = wrapper => clickButton(wrapper, /end turn/i);
  const clickPass = wrapper => clickButton(wrapper, /pass/i);
  const clickEndGame = wrapper => clickButton(wrapper, /end.*game/i);
  const clickSubmitLeftovers = wrapper => clickButton(wrapper, /submit.*leftovers/i);
  const clickBingo = wrapper => wrapper.find('#bingoToggle').simulate('change');
  const clickLetterModifier = (wrapper, letterIndex, modifier) => {
    wrapper.find('WithModifierPopover').at(letterIndex).find('Tooltip').prop('onVisibilityChange')(true);
    wrapper.update();
    wrapper.find('WithModifierPopover').at(letterIndex).find('Tooltip').find(`.modifier.${modifier}`)
      .simulate('click');
  };
  const clickUndoMultipleTimes = (wrapper, numTimes) => {
    for (let i = 0; i < numTimes; i++) {
      clickUndo(wrapper);
    }
  };
  const getPlayerNames = (wrapper, playerIndex) => wrapper.find('th.player-header').at(playerIndex).text();
  const getNumberOfPlayers = wrapper => wrapper.find('th.player-header').length;
  const getCurrentPlayer = wrapper => wrapper.find('.call-player-to-action').text();

  const getValue = (grid, moveIndex, playerIndex, wordIndex) => getScoreGridCell(grid, moveIndex, playerIndex).find('tr').at(wordIndex).text();
  const getMoveNumber = (grid, moveIndex) => grid.find('tbody tr.turn-row').at(moveIndex).find('th').text();
  const getTotal = grid => grid.find('ScoreGrid').find('tr.total-score').find('th').text();
  const getTotalCell = (grid, playerIndex) => grid.find('ScoreGrid').find('tr.total-score').find('td').at(playerIndex)
    .text();
  const getScoreGridCell = (grid, moveIndex, playerIndex) => grid.find('tbody tr.turn-row').at(moveIndex).find('ScoreGridCell').at(playerIndex);
  const getWordAt = (grid, moveIndex, playerIndex, wordIndex) => getScoreGridCell(grid, moveIndex, playerIndex).find('WordInTiles').at(wordIndex).props().word.value;
  const getWinner = wrapper => wrapper.find('.winner').find('h1').text();
  const getLetterModifier = (wrapper, letterIndex) => wrapper.find('WithModifierPopover').at(letterIndex).find('ScrabbleTile').prop('modifier');
  const getTableLetterModifier = (grid, moveIndex, playerIndex, wordIndex, letterIndex) => getScoreGridCell(grid, moveIndex, playerIndex).find('WordInTiles').at(wordIndex).find('ScrabbleTile')
    .at(letterIndex)
    .prop('modifier');
  const getTile = (wrapper, letterIndex) => wrapper.find('ScrabbleInputBox').find('ScrabbleTile').at(letterIndex);
  const checkLetterTiles = (wrapper, letterTiles) => {
    letterTiles.forEach((tile, i) => {
      expect(getTile(wrapper, i)).toHaveText(tile);
    });
  };
  const getCurrentLanguage = wrapper => wrapper.find('ScoreKeeper').prop('language');
  const checkIfButtonDisabled = (wrapper, regex) => wrapper.find('button').filterWhere(n => n.text().match(regex)).prop('disabled');
  const getbuttonText = (wrapper, buttonIndex) => wrapper.find('button').at(buttonIndex).text();

  /* .tap(n => console.log(n.debug())) */


  it('fills Players', () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 4);

    expect(getNumberOfPlayers(wrapper)).toEqual(4);
    expect(getPlayerNames(wrapper, 0)).toEqual('Anna');
    expect(getPlayerNames(wrapper, 1)).toEqual('Nico');
    expect(getPlayerNames(wrapper, 2)).toEqual('Kyle');
    expect(getPlayerNames(wrapper, 3)).toEqual('Sofi');
  });

  it("if no name, prints 'Player ' + playerIndex", () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    wrapper.find('button').simulate('click');

    expect(getNumberOfPlayers(wrapper)).toEqual(2);
    expect(getPlayerNames(wrapper, 0)).toEqual('Player 1');
    expect(getPlayerNames(wrapper, 1)).toEqual('Player 2');
  });

  it('disables Undo button, if no games played', () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 4);
    typeInputBox(wrapper, 'ouguiya');

    expect(checkIfButtonDisabled(wrapper, /undo/i)).toEqual(true);
    clickAddWord(wrapper);
    expect(checkIfButtonDisabled(wrapper, /undo/i)).toEqual(false);
  });

  it('disables Add Word button, if no letters typed', () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 4);
    expect(checkIfButtonDisabled(wrapper, /add.*word/i)).toEqual(true);
    typeInputBox(wrapper, 'ouguiya');
    expect(checkIfButtonDisabled(wrapper, /add.*word/i)).toEqual(false);
  });

  it("disables End Game button, if it's not the first player's turn and he didn't type any letters yet", () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 2);
    expect(checkIfButtonDisabled(wrapper, /end.*game/i)).toEqual(true);
    typeInputBox(wrapper, 'quizzify');
    expect(checkIfButtonDisabled(wrapper, /end.*game/i)).toEqual(true);
    clickEndTurn(wrapper);
    expect(checkIfButtonDisabled(wrapper, /end.*game/i)).toEqual(true);
    typeInputBox(wrapper, 'oouiya');
    expect(checkIfButtonDisabled(wrapper, /end.*game/i)).toEqual(true);
    clickEndTurn(wrapper);
    expect(checkIfButtonDisabled(wrapper, /end.*game/i)).toEqual(false);
  });

  it("if no leftovers typed inside input box, button will say 'submit no leftovers'", () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 3);


    expect(getbuttonText(wrapper, 1)).toEqual('PASS');

    typeInputBox(wrapper, 'aalii'); // p0: 5
    clickEndTurn(wrapper);
    typeInputBox(wrapper, 'jota'); // p1: 11
    clickEndTurn(wrapper);
    typeInputBox(wrapper, 'kex'); // p2: 14
    clickEndTurn(wrapper);

    clickEndGame(wrapper);

    // END GAME
    expect(getbuttonText(wrapper, 0)).toEqual('SUBMIT NO LEFTOVERS');
    typeInputBox(wrapper, 'q');
    expect(getbuttonText(wrapper, 0)).toEqual('SUBMIT LEFTOVERS');
  });

  it("if no word typed, End Game button displays 'PASS'", () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 3);
    expect(getbuttonText(wrapper, 1)).toEqual('PASS');
    typeInputBox(wrapper, 'q');
    expect(getbuttonText(wrapper, 1)).toEqual('END TURN');
  });

  it('types inside the scrabble input box', () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 3);
    typeInputBox(wrapper, 'quizzify');
    checkLetterTiles(wrapper, ['Q10', 'U1', 'I1', 'Z10', 'Z10', 'I1', 'F4', 'Y4']);
  });

  it("case insensitive and doesn't allow any characters except letters inside Scrabble Input Box", () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 3);
    typeInputBox(wrapper, '!1q uetzAls=');
    checkLetterTiles(wrapper, ['Q10', 'U1', 'E1', 'T1', 'Z10', 'A1', 'L1', 'S1']);
  });

  it(`In game controls: addWord, endTurn, PASS, toggleBingo, endGame --- work properly;
		scoreGrid: move number, submitted words, total --- display correctly;
		currentPlayer: currnet player name/inGame & inGameOver sentence changes correctly;
		currentWordScore: display score for current word;
		unlimited undoes;`, () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 4);

    typeInputBox(wrapper, 'aalii'); // p0: 5
    clickAddWord(wrapper);
    typeInputBox(wrapper, 'ouguiya'); // p0: 11
    clickAddWord(wrapper);
    clickEndTurn(wrapper);
    // Move 0: P0 - 16
    typeInputBox(wrapper, 'jota'); // p1: 11
    clickEndTurn(wrapper);
    // Move 0: P0 - 16
    //				P1 - 11
    typeInputBox(wrapper, 'kex'); // p2: 14
    clickEndTurn(wrapper);
    // Move 0: P0 - 16
    //				P1 - 11
    //				P2 - 14
    typeInputBox(wrapper, 'ziti'); // p3: 13
    clickEndTurn(wrapper);
    // Move 0: P0 - 16
    //				P1 - 11
    //				P2 - 14
    //				P3 - 13
    typeInputBox(wrapper, 'knickknack'); // p0: 30
    clickAddWord(wrapper);
    clickBingo(wrapper);		// p0: BINGO
    clickEndTurn(wrapper);
    // Move 1: P0 - 96
    //				P1 - 11
    //				P2 - 14
    //				P3 - 13
    typeInputBox(wrapper, 'pizza'); // p1: 25
    clickEndTurn(wrapper);
    // Move 1: P0 - 96
    //				P1 - 36
    //				P2 - 14
    //				P3 - 13
    typeInputBox(wrapper, 'oorie'); // p2: 5
    clickEndTurn(wrapper);
    // Move 1: P0 - 96
    //				P1 - 36
    //				P2 - 19
    //				P3 - 13
    typeInputBox(wrapper, 'ourie'); // p3: 5
    clickEndTurn(wrapper);
    // Move 1: P0 - 96
    //				P1 - 36
    //				P2 - 19
    //				P3 - 18

    clickPass(wrapper); // p0: PASS
    // Move 2: P0 - 96
    //				P1 - 36
    //				P2 - 19
    //				P3 - 18
    typeInputBox(wrapper, 'za'); // p1:  11
    clickAddWord(wrapper);
    typeInputBox(wrapper, 'muzjiks'); // p1:  29
    clickAddWord(wrapper);
    typeInputBox(wrapper, 'aerie'); // p1:  5
    clickEndTurn(wrapper);
    // Move 2: P0 - 96
    //				P1 - 81
    //				P2 - 19
    //				P3 - 18
    typeInputBox(wrapper, 'caziques'); // p2:  28
    clickAddWord(wrapper);
    typeInputBox(wrapper, 'faqir'); // p2: 17
    clickAddWord(wrapper);
    clickEndTurn(wrapper);
    // Move 2: P0 - 96
    //				P1 - 81
    //				P2 - 64
    //				P3 - 18
    typeInputBox(wrapper, 'jousted'); // p3:  15
    clickAddWord(wrapper);
    typeInputBox(wrapper, 'quixotry'); // p3: 27
    clickAddWord(wrapper);
    typeInputBox(wrapper, 'jukebox'); // p3: 27
    clickEndTurn(wrapper);
    // Move 2: P0 - 96
    //				P1 - 81
    //				P2 - 64
    //				P3 - 87

    const grid = wrapper.find('ScoreGrid');


    //                   move, player, word
    expect(getMoveNumber(grid, 0)).toEqual('1');
    expect(getWordAt(grid, 0, 0, 0)).toEqual('aalii');
    expect(getWordAt(grid, 0, 0, 1)).toEqual('ouguiya');
    expect(getWordAt(grid, 0, 1, 0)).toEqual('jota');
    expect(getWordAt(grid, 0, 2, 0)).toEqual('kex');
    expect(getWordAt(grid, 0, 3, 0)).toEqual('ziti');
    expect(getMoveNumber(grid, 1)).toEqual('2');
    expect(getWordAt(grid, 1, 0, 0)).toEqual('knickknack');
    expect(getValue(grid, 1, 0, 1)).toMatch(/BINGO/);
    expect(getValue(grid, 2, 0, 0)).toMatch(/PASS/);
    expect(getWordAt(grid, 1, 1, 0)).toEqual('pizza');
    expect(getWordAt(grid, 1, 2, 0)).toEqual('oorie');
    expect(getWordAt(grid, 1, 3, 0)).toEqual('ourie');
    expect(getMoveNumber(grid, 2)).toEqual('3');
    expect(getCurrentPlayer(wrapper)).toEqual('Anna, submit a word or end turn');
    expect(getTotalCell(grid, 0)).toEqual('96');
    expect(getTotalCell(grid, 1)).toEqual('81');
    expect(getTotalCell(grid, 2)).toEqual('64');
    expect(getTotalCell(grid, 3)).toEqual('87');

    typeInputBox(wrapper, 'jukebox');
    typeInputBox(wrapper, '');

    clickEndGame(wrapper);
    // END GAME

    expect(getCurrentPlayer(wrapper)).toEqual('Anna, submit your leftovers');
    typeInputBox(wrapper, 'lii'); // p0: -3
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 93
    // P1 - 81
    // P2 - 64
    // P3 - 87
    expect(getCurrentPlayer(wrapper)).toEqual('Nico, submit your leftovers');
    typeInputBox(wrapper, 'd'); // p1: -2
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 93
    // P1 - 79
    // P2 - 64
    // P3 - 87
    expect(getTotalCell(grid, 1)).toEqual('79');
    typeInputBox(wrapper, 'a'); // p2: -1
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 93
    // P1 - 79
    // P2 - 63
    // P3 - 87
    expect(getCurrentPlayer(wrapper)).toEqual('Sofi, submit your leftovers');
    clickSubmitLeftovers(wrapper); // p3: +6
    // ENDGAME
    // P0 - 93
    // P1 - 79
    // P2 - 63
    // P3 - 93

    expect(getTotalCell(grid, 0)).toEqual('93');
    expect(getTotalCell(grid, 1)).toEqual('79');
    expect(getTotalCell(grid, 2)).toEqual('63');
    expect(getTotalCell(grid, 3)).toEqual('93');
    expect(getWinner(wrapper)).toEqual('Anna won with 96 points!'); // Tie game P0: 93 and P3: 93 ---> Before leftovers P0: 96 and P3: 87 ---> P0 won!, Anna won!
    clickUndo(wrapper);
    // UNDO: 1
    // ENDGAME
    // P0 - 93
    // P1 - 79
    // P2 - 63
    // P3 - 87
    typeInputBox(wrapper, 'f'); // p3: -4
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 93
    // P1 - 79
    // P2 - 63
    // P3 - 83
    expect(getWinner(wrapper)).toEqual('Anna won with 93 points!'); // P0: 93 max points ---> P0 won!, Anna won!
    clickUndoMultipleTimes(wrapper, 4);
    // ENDGAME
    // P0 - 96
    // P1 - 81
    // P2 - 64
    // P3 - 87

    typeInputBox(wrapper, 'zax'); // p0: -19
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 77
    // P1 - 81
    // P2 - 64
    // P3 - 87
    typeInputBox(wrapper, 'd'); // p1: -2
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 77
    // P1 - 79
    // P2 - 64
    // P3 - 87
    typeInputBox(wrapper, 'a'); // p2: -1
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 77
    // P1 - 79
    // P2 - 63
    // P3 - 87
    clickSubmitLeftovers(wrapper); // p3: +22
    // ENDGAME
    // P0 - 77
    // P1 - 79
    // P2 - 63
    // P3 - 109
    expect(getWinner(wrapper)).toEqual('Sofi won with 109 points!');// P3: 109 max points ---> P3 won!, Sofi won!
    expect(getTotalCell(grid, 3)).toEqual('109');
    clickUndoMultipleTimes(wrapper, 5);
    // Move 2: P0 - 96
    //				P1 - 81
    //				P2 - 64
    //				P3 - 87
    clickPass(wrapper); // p0: PASS
    // Move 3: P0 - 96
    //				P1 - 81
    //				P2 - 64
    //				P3 - 87
    typeInputBox(wrapper, 'backers'); // p1: 15
    clickEndTurn(wrapper);
    // Move 3: P0 - 96
    //				P1 - 96
    //				P2 - 64
    //				P3 - 87
    typeInputBox(wrapper, 'queue'); // p2: 14
    clickEndTurn(wrapper);
    // Move 3: P0 - 96
    //				P1 - 96
    //				P2 - 78
    //				P3 - 87
    clickPass(wrapper); // p3: PASS
    // Move 3: P0 - 96
    //				P1 - 96
    //				P2 - 78
    //				P3 - 87
    clickEndGame(wrapper);
    // END GAME
    typeInputBox(wrapper, 'a'); // p0: -1
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 95
    // P1 - 79
    // P2 - 78
    // P3 - 87
    typeInputBox(wrapper, 'a'); // p1: -1
    clickSubmitLeftovers(wrapper);
    // ENDGAME
    // P0 - 95
    // P1 - 95
    // P2 - 78
    // P3 - 87
    clickSubmitLeftovers(wrapper); // p2: +2
    // ENDGAME
    // P0 - 95
    // P1 - 95
    // P2 - 80
    // P3 - 87
    clickSubmitLeftovers(wrapper);// p2: +2
    // ENDGAME
    // P0 - 95
    // P1 - 95
    // P2 - 80
    // P3 - 89
    expect(getWinner(wrapper)).toEqual('Anna: 96 points, Nico: 96 points'); // Tie game P0: 95 and P1: 95 ---> Before leftovers P0: 96 and P1: 96 ---> Tie game: P0 and P1 (Anna and Nico
    clickUndoMultipleTimes(wrapper, 31);
    // UNDO TO THE BEGINNING OF THE GAME
    expect(getTotalCell(grid, 0)).toEqual('0');
    expect(getTotalCell(grid, 1)).toEqual('0');
    expect(getTotalCell(grid, 2)).toEqual('0');
    expect(getTotalCell(grid, 3)).toEqual('0');
    expect(getTotal(grid)).toEqual('TOTAL');
  });

  it('leftover on the last player', () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 3);

    clickPass(wrapper);
    clickPass(wrapper);
    clickPass(wrapper);
    clickEndGame(wrapper);

    const grid = wrapper.find('ScoreGrid');

    typeInputBox(wrapper, 'aalii'); // p0: -5
    clickSubmitLeftovers(wrapper);
    expect(getTotalCell(grid, 0)).toEqual('-5');

    typeInputBox(wrapper, 'jukebox'); // p0: -27
    clickSubmitLeftovers(wrapper);
    expect(getTotalCell(grid, 1)).toEqual('-27');

    typeInputBox(wrapper, 'no'); // p0: -2
    clickSubmitLeftovers(wrapper);
    expect(getTotalCell(grid, 2)).toEqual('-2');

    expect(getWinner(wrapper)).toEqual('Kyle won with -2 points!');
  });


  it(`modifier tooltip works;
			adds modifiers tooltip to the tiles in the InputBox;
			adds modifiers tooltip to the tiles in the TableCells;`, () => {
    const wrapper = mount(<ScrabbleScoreKeeper />);
    fillPlayers(wrapper, 2);
    typeInputBox(wrapper, 'reapers'); // p0: 8
    clickLetterModifier(wrapper, 3, 'triple-word');
    expect(getLetterModifier(wrapper, 3)).toEqual('triple-word');
    clickLetterModifier(wrapper, 6, 'double-letter');
    expect(getLetterModifier(wrapper, 3)).toEqual('triple-word');
    clickLetterModifier(wrapper, 0, 'triple-letter');
    expect(getLetterModifier(wrapper, 0)).toEqual('triple-letter');
    clickLetterModifier(wrapper, 2, 'double-word');
    expect(getLetterModifier(wrapper, 2)).toEqual('double-word');
    clickLetterModifier(wrapper, 5, 'blank');
    expect(getLetterModifier(wrapper, 5)).toEqual('blank');
    clickLetterModifier(wrapper, 5, 'blank');
    expect(getLetterModifier(wrapper, 5)).toEqual(null);
    clickAddWord(wrapper);
    const grid = wrapper.find('ScoreGrid');
    expect(getTableLetterModifier(grid, 0, 0, 0, 0)).toEqual('triple-letter'); // (grid, moveIndex, playerIndex, wordIndex, letterIndex)
    expect(getTableLetterModifier(grid, 0, 0, 0, 1)).toEqual(null);
  });

  it("changes languages: ru, fr; can't type other characters exept the current language", () => {
    const wrapper1 = mount(<ScrabbleScoreKeeper />);
    chooseLanguage(wrapper1, 'ru');
    fillPlayers(wrapper1, 2);
    expect(getCurrentLanguage(wrapper1)).toEqual('ru');
    typeInputBox(wrapper1, 'quizzifyф');
    checkLetterTiles(wrapper1, ['Ф10']);

    const wrapper2 = mount(<ScrabbleScoreKeeper />);
    chooseLanguage(wrapper2, 'fr');
    fillPlayers(wrapper2, 2);
    expect(getCurrentLanguage(wrapper2)).toEqual('fr');
    typeInputBox(wrapper2, 'фываqk');
    checkLetterTiles(wrapper2, ['Q8', 'K10']);
  });
});
