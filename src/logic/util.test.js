/* eslint-disable */
import { resizeArray, scrabbleScore, isLetterAllowed, indexesOf, toggleModifiers } from './Util';

describe('scrabbleScore', () => {
  test('counts score without modifiers', () => {
    const word = 'happy'; // 15
    const modifiers = [[], [], [], [], []]; 
    expect(scrabbleScore(word, modifiers, 'en')).toEqual(15);
  });

  test('counts correctly with any modifier', () => {
    const longWord = 'nonplussed'; // 13
    const modifiers = [['triple-word'], ['double-letter'], ['triple-letter'], [], ['triple-letter'], [], ['triple-letter'], [], ['double-word'], ['blank']]; // 108
    expect(scrabbleScore(longWord, modifiers, 'en')).toEqual(108);
  });

  test('calculates French and Russian', () => {
    expect(scrabbleScore('ложка', [['double-letter'], [], ['triple-letter'], [], ['triple-word']], 'ru')).toEqual(69);
    expect(scrabbleScore('yeux', [['double-letter'], ['blank'], ['triple-word'], ['triple-letter']], 'fr')).toEqual(153);
  });
});

describe('resizeArray', () => {
  test('makes correct length of an array', () => {
    expect(resizeArray([], 2, 'a')).toEqual(['a', 'a']);
    expect(resizeArray([1, 2, 3], 2, 4)).toEqual([1, 2]);
    expect(resizeArray(['a', 'a'], 2, 'a')).toEqual(['a', 'a']);
  });

  test('takes a default value of any type', () => {
    expect(resizeArray([], 2, 1)).toEqual([1, 1]);
    expect(resizeArray([], 2, { a: 'b' })).toEqual([{ a: 'b' }, { a: 'b' }]);
  });

  test("doesn't change the original array", () => {
    const tripleA = ['a', 'a', 'a'];
    resizeArray(tripleA, 4, 'a');
    expect(tripleA).toEqual(['a', 'a', 'a']);
  });

  test("calculates correctly if two modifiers (blank and something else) are added", () => {
    const word = 'happy'; // 15
    let modifiers = [['double-letter', 'blank'], [], [], [], []]; 
    expect(scrabbleScore(word, modifiers, 'en')).toEqual(11);
    modifiers = [['double-letter', 'blank'], ['double-word'], [], [], []]; 
    expect(scrabbleScore(word, modifiers, 'en')).toEqual(22);
  })

});

describe('isLetterAllowed', () => {
  test('only allows letters', () => {
    expect(isLetterAllowed('1', 'en')).toEqual(false);
    expect(isLetterAllowed(' ', 'ru')).toEqual(false);
    expect(isLetterAllowed('/', 'ru')).toEqual(false);
    expect(isLetterAllowed('a', 'fr')).toEqual(true);
  });

  test('filters characters according to the language', () => {
    expect(isLetterAllowed('a', 'en')).toEqual(true);
    expect(isLetterAllowed('ф', 'ru')).toEqual(true);
    expect(isLetterAllowed('f', 'ru')).toEqual(false);
  });
});

describe('indexesOf', () => {
  test('writes down indexes of the same values', () => {
    expect(indexesOf(['a', 'b', 'c'], 'a')).toEqual([0]);
    expect(indexesOf(['a', 'a', 'c'], 'a')).toEqual([0, 1]);
    expect(indexesOf(['a', 'a', 'a'], 'a')).toEqual([0, 1, 2]);
    expect(indexesOf(['a', 'a', 'a', 'b', 'c', 'a', 'a', 'c'], 'a')).toEqual([0, 1, 2, 5, 6]);
    expect(indexesOf(['b', 'a', 'c'], 'a')).toEqual([1]);
  });
});

describe('toggleModifiers', () => {
  test('adding modifier in an empty array', () => {
    expect(toggleModifiers([], 'tripple-letter')).toEqual(['tripple-letter']);
  });
  test('if the same modifier added, delete modifier', () => {
    expect(toggleModifiers(['tripple-letter'], 'tripple-letter')).toEqual([]);
  });

  test('take out the same modifier, when "blank" is also there', () => {
    expect(toggleModifiers(['blank', 'double-letter'], 'double-letter')).toEqual(['blank']);
  });

  test('if no "blank" modifier, only one modifier is allowed', () => {
    expect(toggleModifiers(['double-letter'], 'tripple-letter')).toEqual(['tripple-letter']);
  });

  test('add "blank" to modifier', () => {
    expect(toggleModifiers(['tripple-letter'], 'blank')).toEqual(['blank', 'tripple-letter']);
  });

   test('if "blank" modifier in an array,two modifiers allowed modifier is allowed', () => {
    expect(toggleModifiers(['blank'], 'tripple-letter')).toEqual(['blank', 'tripple-letter']);
  });

  test('blank can only be in the same array with one modifier', () => {
    expect(toggleModifiers(['blank', 'double-letter'], 'tripple-letter')).toEqual(['blank', 'tripple-letter']);
  });
});