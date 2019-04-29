import {scoreListsMap} from './scoreLists';

export function resizeArray(array, desiredLength, defaultValue) {
  let output = array.slice(0, desiredLength);
  while (output.length < desiredLength)
    output.push(defaultValue);
  return output;
}

/*
indexesOf(array, value)
return an array of indexes  of the result verifies array[i] == value
*/


export function indexesOf(array, value) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      result.push(i)
    }
  }
  return result
}

/* DONE find a way to only have the word "ru" once in your entire codebase. */
/* DONE isLetterAllowed() should be implemented */
export function isLetterAllowed(letter, language) {
  let isAllowed = false;
  if (typeof scoreListsMap[language].scores[letter.toLowerCase()] === 'number') 
    isAllowed = true
  return isAllowed
}

export function scrabbleScore(word, modifiers, language) {
  for (let i = 0 ; i < word.length; i ++) {
    if (modifiers[i] != null ) { 
      switch (modifiers[i]) {
        case 'blank':
          word = word.slice(0, i) + word.slice(i+1);break;
        case 'double-letter':
          word += word[i];break;
        case 'triple-letter':
          word+= word[i].repeat(2);break;
        default:
          word += '';
      }
    }
  }

  for (let i = 0 ; i < word.length; i ++) {
    if (modifiers[i] != null ) { 
      switch (modifiers[i]) {
        case 'double-word':
          word += word;break;
        case 'triple-word':
          word+=word.repeat(2);break;
        default:
          word += '';
      }
    }
  } 

  const letterScore = letter => scoreListsMap[language].scores[letter];
  let result = 0;
  for (let i=0; i < word.length; i++) {
    result += letterScore(word[i].toLowerCase())
  }
  return result;
}

export default null;