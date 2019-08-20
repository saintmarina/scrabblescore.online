import amplitude from 'amplitude-js';
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

export function logEventInit() {
  amplitude.getInstance().init('908142045794995ec39e6025a04bfdb4');
}

export function isStaticBuild() {
    return navigator.userAgent === 'ReactSnap';
  }

export function isInProduction() {
  return process.env.NODE_ENV === 'production';
}

export function logEvent(eventName, eventData) {
  if (isStaticBuild() || !isInProduction()) {
    return;
  }

  try {
    amplitude.getInstance().logEvent(eventName, eventData)
  }
  catch(error) {
    console.log(`Something went wrong when logging an event. ${error}.`)
  }
}

export function scrollToTop() {
  const bodyElement = document.getElementsByTagName('body');
  bodyElement[0].scrollIntoView(true)
}

export function scrollToMiddle() {
  const inputBoxElement = document.getElementsByClassName('add-word');
  inputBoxElement[0].scrollIntoView({ block: 'center' })
}

export default null;
