import {scoreListsMap} from './scoreLists';

export function resizeArray(array, desiredLength, defaultValue) {
  let output = array.slice(0, desiredLength);
  while (output.length < desiredLength)
    output.push(defaultValue);
  return output;
}

/* DONE do not duplicate the score lists */
/* DONE put all the score lists in a separate file */
/* DONE find a way to only have the word "ru" once in your entire codebase. */

/* DONE rename isLetterAllowed */
/*export function isLetterAllowed(str, language) {
  let list;
  
  switch (language) {
    case 'en': list = EnglishScoreList;break;
    case 'fr': list = FrenchScoreList;break;
    case 'ru': list = RussianScoreList;break;
    default: list = EnglishScoreList;break;
  }

  let Str = str.toLowerCase()
  if (Str in list) 
    return list
}*/


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

 
  /* DONE no switches */
 

  const letterScore = letter => scoreListsMap[language]()[letter] || 0;
  let result = 0;
  for (let i=0; i < word.length; i++) {
    result += letterScore(word[i].toLowerCase())
  }
  return result;
}

export default null;