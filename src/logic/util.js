import { scoreListsMap } from './scoreLists';

export function resizeArray(array, desiredLength, defaultValue) {
  const output = array.slice(0, desiredLength);
  while (output.length < desiredLength) output.push(defaultValue);
  return output;
}

export function indexesOf(array, value) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      result.push(i);
    }
  }
  return result;
}

export function isLetterAllowed(letter, language) {
  return letter.toLowerCase() in scoreListsMap[language].scores;
}

export function scrabbleScore(word, modifiers, language) {
  let result = 0;

  word.split('').forEach((letter, i) => {
    let score = scoreListsMap[language].scores[letter.toLowerCase()];
    // eslint-disable-next-line
    switch (modifiers[i]) {
      case 'blank': score *= 0; break;
      case 'double-letter': score *= 2; break;
      case 'triple-letter': score *= 3; break;
    }
    result += score;
  });

  modifiers.forEach((modifier) => {
    // eslint-disable-next-line
    switch (modifier) {
      case 'double-word': result *= 2; break;
      case 'triple-word': result *= 3; break;
    }
  });
  return result;
}

export default null;
