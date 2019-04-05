export function resizeArray(array, desiredLength, defaultValue) {
  let output = array.slice(0, desiredLength);
  while (output.length < desiredLength)
    output.push(defaultValue);
  return output;
}

/* TODO do not duplicate the score lists */
/* TODO put all the score lists in a separate file */
/* TODO find a way to only have the word "ru" once in your entire codebase. */

/* TODO rename isLetterAllowed */
export function isInScoreList(str) {
  const EnglishScoreList = { a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, r: 1, s: 1,
    t: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4,
    k: 5, j: 8, x: 8, q: 10, z: 10 }

  const FrenchScoreList = { e: 1, a: 1, i: 1, n: 1, o: 1, r: 1, s:1, t: 1, u: 1, l: 1,
  d: 2, m: 2, g: 2, b: 3, c: 3, p: 3, f: 4, h: 4, v:4, j: 8, q: 8, k: 10,
  w: 10, x: 10, y: 10, z: 10}

  const RussianScoreList = { о: 1, а: 1, е: 1, и: 1, н: 1, р: 1, с: 1, т: 1, в: 1,
  д: 2, к: 2, л: 2, п: 2, у: 2, м: 2, б: 3, г: 3, ь: 3, я: 3, ё: 3, ы: 4, й: 4,
  з: 5, ж: 5, х: 5, ц: 5, ч: 5, ш: 8, э: 8, ю: 8, ф: 10, щ: 10, ъ: 10 }

  let Str = str.toLowerCase()
  if (Str in EnglishScoreList || Str in FrenchScoreList || Str in RussianScoreList)
    return true
}


export function scrabbleScore(word, modifiers, language) {
  let scoreList;
  const EnglishScoreList = { a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, r: 1, s: 1,
    t: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4,
    k: 5, j: 8, x: 8, q: 10, z: 10 };

  const FrenchScoreList = { e: 1, a: 1, i: 1, n: 1, o: 1, r: 1, s:1, t: 1, u: 1, l: 1,
  d: 2, m: 2, g: 2, b: 3, c: 3, p: 3, f: 4, h: 4, v:4, j: 8, q: 8, k: 10,
  w: 10, x: 10, y: 10, z: 10};

  const RussianScoreList = { о: 1, а: 1, е: 1, и: 1, н: 1, р: 1, с: 1, т: 1, в: 1,
  д: 2, к: 2, л: 2, п: 2, у: 2, м: 2, б: 3, г: 3, ь: 3, я: 3, ё: 3, ы: 4, й: 4,
  з: 5, ж: 5, х: 5, ц: 5, ч: 5, ш: 8, э: 8, ю: 8, ф: 10, щ: 10, ъ: 10 }


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

 switch(language) {
  /* TODO no switches */
  case 'en':
    scoreList = EnglishScoreList; break;
  case 'fr':
    scoreList = FrenchScoreList; break;
  case 'ru':
    scoreList = RussianScoreList; break;
  default:
      scoreList = EnglishScoreList;
 }

  const letterScore = letter => scoreList[letter] || 0;
  let result = 0;
  for (let i=0; i < word.length; i++) {
    result += letterScore(word[i].toLowerCase())
  }
  return result;
}

export default null;