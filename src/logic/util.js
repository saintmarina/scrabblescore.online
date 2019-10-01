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

function __toggleSingleModifier(oldModifiers, modifier) {
  if (oldModifiers.length === 0)
    return [modifier];
  return (oldModifiers[0] === modifier) ? [] : [modifier];
}

export function toggleModifiers(oldModifiers, modifier) {
  let modifiersA = oldModifiers.filter(mod => mod === 'blank');
  let modifiersB = oldModifiers.filter(mod => mod !== 'blank');

  if (modifier === 'blank')
    modifiersA = __toggleSingleModifier(modifiersA, modifier);
  else
    modifiersB = __toggleSingleModifier(modifiersB, modifier);

  return [...modifiersA, ...modifiersB];
}

export function isLetterAllowed(letter, language) {
  return letter.toLowerCase() in scoreListsMap[language].scores;
}

export function scrabbleScore(word, modifiers, language) {
  let result = 0;

  word.split('').forEach((letter, i) => {
    let score = scoreListsMap[language].scores[letter.toLowerCase()];
    for (let j=0; j < modifiers[i].length; j++) {
      // eslint-disable-next-line
      switch (modifiers[i][j]) {
        case 'blank': score *= 0; break;
        case 'double-letter': score *= 2; break;
        case 'triple-letter': score *= 3; break;
      }
    }
    result += score;
  })
  
  modifiers.forEach((modifier) => {
    for (let j=0; j < modifier.length; j++) {
    // eslint-disable-next-line
      switch (modifier[j]) {
        case 'double-word': result *= 2; break;
        case 'triple-word': result *= 3; break;
      }
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

export function isCordova() {
  return navigator.userAgent.includes("cordova");
}

export function isProduction() {
  return process.env.NODE_ENV === 'production'; // eslint-disable-line no-use-before-define
}

export function isTest() {
  return process.env.NODE_ENV === 'test';
}

export function logEvent(eventName, eventData) {
  if (isStaticBuild() || !isProduction())
    return;

  try {
    amplitude.getInstance().logEvent(eventName, eventData)
  } catch(error) {
    console.log(`Something went wrong when logging an event. ${error}.`)
  }
}

export function scrollToTop() {
  const bodyElement = document.getElementsByTagName('body');
  bodyElement[0].scrollIntoView(true)
}

export function scrollToMiddle() {
  const inputBoxElement = document.getElementsByClassName('middle-scroll-anchor');
  inputBoxElement[0].scrollIntoView({ block: 'center' })
}

export function persistState(stateObj) {
  window.localStorage.setItem('ScrabbleState', JSON.stringify(stateObj));
}

export function getPersistedState() {
  const state = window.localStorage.getItem('ScrabbleState');
  return state ? JSON.parse(state) : null;
}

export function clearPersistedState() {
  window.localStorage.removeItem('ScrabbleState');
}

export default null;
