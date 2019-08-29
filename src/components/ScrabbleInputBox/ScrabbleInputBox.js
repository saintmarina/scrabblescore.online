import React from 'react';
import { resizeArray, scrabbleScore, isLetterAllowed, logEvent } from '../../logic/util';
import WithModifierPopover from './WithModifierPopover';
import ScrabbleTile from '../ScrabbleTile/ScrabbleTile';
import './ScrabbleInputBox.css';

class ScrabbleInputBox extends React.Component {
  static _clickOnElementByClass(className) {
    const elements = document.getElementsByClassName(className);
    if (elements.length !== 0) elements[0].click();
  }

  constructor(props) {
    super(props);
    this.textHiddenInput = React.createRef();
    this.focus = this.focus.bind(this);
    this.handleHiddenInputChange = this.handleHiddenInputChange.bind(this);
    this.handleTileClick = this.handleTileClick.bind(this);
    this.state = {
      inFocus: false,
    };
  }

  handleHiddenInputChange(e) {
    const { language, word, onChange } = this.props;
    const input = e.target.value.substring(0,15); /* maxLength does not always work on Android */
    const result = input.split('').map(letter => (isLetterAllowed(letter, language) ? letter : ''));
    const modifiers = resizeArray(word.modifiers, result.length, null);
    onChange({ value: result.join(''), modifiers });
    this.constructor._clickOnElementByClass('hidden-input');
  }

  handleModifierChange(letterIndex, modifier) {
    const { word, onChange } = this.props;
    const modifiers = word.modifiers.slice();
    modifiers[letterIndex] = modifier;
    onChange({ value: word.value, modifiers });

    logEvent('modifier-added', {value: word.value, modifiers});
  }

  handleTileClick() {
    this.focus();
  }

  focus() {
    this.textHiddenInput.current.focus();
  }

  render() {
    const { language, word } = this.props;
    const { inFocus } = this.state;

    function handleArrowClick(e) {
      if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
        e.preventDefault()
      }
    }

    return (
      <div role="textbox" onClick={this.focus} onKeyDown={this.focus} className={`scrabble-input-box${word.value.length > 8 ? ' large' : ''}`}>
        <input
          ref={this.textHiddenInput}
          onChange={this.handleHiddenInputChange}
          onKeyDown={(e) => handleArrowClick(e)}
          value={word.value}
          className="hidden-input"
          onBlur={() => this.setState({ inFocus: false })}
          onFocus={() => this.setState({ inFocus: true })}
          type="text"
          maxLength="15"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          autoCorrect="off"
        />
        <div className={inFocus ? 'scrabble-tiles blinker' : 'scrabble-tiles'}>
          {word.value.split('').map((letter, letterIndex) => (
            <WithModifierPopover
              onChange={modifier => this.handleModifierChange(letterIndex, modifier)}
              key={letterIndex}
            >
              <ScrabbleTile
                onClick={this.handleTileClick}
                letter={letter}
                score={scrabbleScore(letter, [null], language)}
                modifier={word.modifiers[letterIndex]}
              />
            </WithModifierPopover>
          ))}
        </div>
      </div>
    );
  }
}


export default ScrabbleInputBox;
