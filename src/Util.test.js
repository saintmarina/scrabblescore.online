import {resizeArray, scrabbleScore} from './Util.js';

let word = 'nonplussed' //13
let modifiers = [null, null, null, null, null, null, null, null, null, null]
let m2l = ['double-letter', null, null, null, null, null, null, null, null, null] //14
let m2w = ['double-word', null, null, null, null, null, null, null, null, null] //26
let m3l = ['triple-letter', null, null, null, null, null, null, null, null, null] //15
let m3w = ['triple-word', null, null, null, null, null, null, null, null, null] //39
let mM = ['triple-word', 'double-letter', null, null, null, null, null, null, null, null] //42
let mC = ['triple-word', 'double-letter', 'triple-letter', null, 'triple-letter', null, 'triple-letter', null, null, null] //42

test('scrabbleScore counts score without modifiers, multiple letters', () => {
	expect(scrabbleScore('a', [null])).toEqual(1);
});

test('scrabbleScore counts score without modifiers', () => {
	expect(scrabbleScore(word, modifiers)).toEqual(13);
});

test ('scrabbleScore counts correctly with double-letter modifier', () => {
	expect(scrabbleScore(word, m2l)).toEqual(14);
});

test ('scrabbleScore counts correctly with double-word modifier', () => {
	expect(scrabbleScore(word, m2w)).toEqual(26);
});

test ('scrabbleScore counts correctly with triple-letter modifier', () => {
	expect(scrabbleScore(word, m3l)).toEqual(15);
});

test ('scrabbleScore counts correctly with double-letter modifier', () => {
	expect(scrabbleScore(word, m3w)).toEqual(39);
});

test ('scrabbleScore counts double/tripple letter before double/triple word', () => {
	expect(scrabbleScore(word, mM)).toEqual(42);
});

test ('scrabbleScore counts complicated modifiers correctly', () => {
	expect(scrabbleScore(word, mC)).toEqual(60);
});


let aEmpty = []

test ('resizeArray makes correct length of an array', () => {
	expect(resizeArray(aEmpty, 2, 'a')).toEqual(['a', 'a'])
});

test ('resizeArray takes value of any type', () => {
	expect(resizeArray(aEmpty, 2, 1)).toEqual([1, 1])
	expect(resizeArray(aEmpty, 2, {a: 'b'})).toEqual([{a: 'b'}, {a: 'b'}])
	expect(resizeArray(aEmpty, 2, null)).toEqual([null, null])
	expect(resizeArray(aEmpty, 2, undefined)).toEqual([undefined, undefined])
	expect(resizeArray(aEmpty, 2, true)).toEqual([true, true])
	expect(resizeArray(aEmpty, 2, ['a'])).toEqual([['a'], ['a']])
});