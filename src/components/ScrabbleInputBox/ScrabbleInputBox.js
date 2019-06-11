import React from 'react';
import { resizeArray, scrabbleScore, isLetterAllowed } from '../../logic/util';
import WithModifierPopover from './WithModifierPopover';

import ScrabbleTile from '../ScrabbleTile/ScrabbleTile';
import './ScrabbleInputBox.css';

class ScrabbleInputBox extends React.Component {
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
    const input = e.target.value;
    const result = input.split('').map(letter => (isLetterAllowed(letter, language) ? letter : ''));
    const modifiers = resizeArray(word.modifiers, result.length, null);
    onChange({ value: result.join(''), modifiers });
    if (document.getElementsByClassName("hidden-input")[0]) { document.getElementsByClassName("hidden-input")[0].click() }
  }

  handleModifierChange(letterIndex, modifier) {
    const { word, onChange } = this.props;
    let modifiers = word.modifiers.slice();
    modifiers[letterIndex] = modifier;
    onChange({ value: word.value, modifiers });
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
    return (
      <div role="textbox" onClick={this.focus} className={`scrabble-input-box${word.value.length > 8 ? ' large' : ''}`}>
        <input
          ref={this.textHiddenInput}
          onChange={this.handleHiddenInputChange}
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
          {word.value.split('').map((c, i) => (
            <WithModifierPopover
              onChange={modifier => this.handleModifierChange(i, modifier)}
              key={i}
            >
              <ScrabbleTile
                onClick={this.handleTileClick}
                letter={c}
                score={scrabbleScore(c, [null], language)}
                modifier={word.modifiers[i]}
              />
            </WithModifierPopover>
          ))}
        </div>
      </div>
    );
  }
}


export default ScrabbleInputBox;
