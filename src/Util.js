import {scoreListsMap} from './scoreLists';

export function resizeArray(array, desiredLength, defaultValue) {
  let output = array.slice(0, desiredLength);
  while (output.length < desiredLength)
    output.push(defaultValue);
  return output;
}

export function indexesOf(array, value) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      result.push(i)
    }
  }
  return result
}


export function isLetterAllowed(letter, language) {
  return letter.toLowerCase() in scoreListsMap[language].scores
}

export function scrabbleScore(word, modifiers, language) {
  let result = 0;
  
  word.split('').forEach((letter, i) => {
    let score = scoreListsMap[language].scores[letter];
    switch (modifiers[i]) {
      case 'blank':         score *= 0; break;
      case 'double-letter': score *= 2; break;
      case 'triple-letter': score *= 3; break;
    }
    result += score
  })

  modifiers.forEach(modifier => {
    switch (modifier) {
      case 'double-word': result *= 2; break;
      case 'triple-word': result *= 3; break;
    }
  })
  return result
}


/*
export function scrabbleScore(word, modifiers, language) {
  let result = 0;

  let letterMulipliers = modifiers.map(modifier => {
    switch (modifier) {
      case 'blank':         return 0;
      case 'double-letter': return 2;
      case 'triple-letter': return 3;
      default:              return 1;
    }
  }

  let wordMulipliers = modifiers.map(modifier => {
    switch (modifier) {
      case 'double-word': return 2;
      case 'triple-word': return 3;
      default:            return 1;
    }
  }
  
  let sum = word.split('')
    .map(letter => scoreListsMap[language].scores[letter])
    .map((letterScore, i) => letterScore * letterMulipliers[i])
    .reduce((acc, val) => acc + val, 0) // sum

  return wordMulipliers.reduce((acc, val) => acc * val, result) // product
}
*/


export default null;