export function resizeArray(array, desiredLength, defaultValue) {
  let output = array.slice(0, desiredLength);
  while (output.length < desiredLength)
    output.push(defaultValue);
  return output;
}

export function scrabbleScore(word, modifiers) {
  for (let i = 0 ; i < word.length; i ++) {
    if (modifiers[i] != null ) { 
      switch (modifiers[i]) {
        case 'double-letter':
          word += word[i];break;
        case 'triple-letter':
          word+= word[i].repeat(2);break;
        default:
          word += '';}}}

  for (let i = 0 ; i < word.length; i ++) {
    if (modifiers[i] != null ) { 
      switch (modifiers[i]) {
        case 'double-word':
          word += word;break;
        case 'triple-word':
          word+=word.repeat(2);break;
        default:
          word += '';}}}

  const scoreList = { a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, r: 1, s: 1,
  t: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4,
  k: 5, j: 8, x: 8, q: 10, z: 10, };

  const letterScore = letter => scoreList[letter] || 0;
  let result = 0;
  for (let i=0; i < word.length; i++) {
    result += letterScore(word[i])
  };
  return result;
}

export default null;