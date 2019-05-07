import React from 'react';
import {resizeArray, scrabbleScore, isLetterAllowed} from './Util.js';
import Tooltip from './Tooltip.js';
import ScrabbleTile from './ScrabbleTile.js';

export class ScrabbleInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.textHiddenInput = React.createRef();
    this.focus = this.focus.bind(this);
    this.handleHiddenInputChange = this.handleHiddenInputChange.bind(this);
    this.state = {
      inFocus: false,
    }
  }

  handleHiddenInputChange(e) {
    let input = e.target.value;
    /* DONE style: spaces around = and += */
    let result = input.split('').map(letter => isLetterAllowed(letter, this.props.language) ? letter : '');
    
    let modifiers = resizeArray(this.props.word.modifiers, result.length, null);
    this.props.onChange({value: result.join(''), modifiers: modifiers})
  }

  handleModifierChange(letterIndex, modifier) {
    let modifiers = this.props.word.modifiers.slice();
    modifiers[letterIndex] = modifier;
    this.props.onChange({value: this.props.word.value, modifiers: modifiers})
  }

  focus() {
    this.textHiddenInput.current.focus()
  }

  render() {
    return (
      <div onClick={this.focus} className={`scrabble-input-box${this.props.word.value.length > 6 ? ' large' : ''}`}>
        {this.state.inFocus && <div className='blinker'></div>}
          <input ref={this.textHiddenInput} onChange={this.handleHiddenInputChange} value={this.props.word.value}
                 className='hidden-input' onBlur={() => this.setState({inFocus: false})} onFocus={() => this.setState({inFocus: true})} type='text' maxLength='15' autoComplete='off' />
        <div className='scrabble-tiles'>
          {this.props.word.value.split('').map((c, i) =>
            <WithModifierPopover onChange={(modifier) => this.handleModifierChange(i, modifier)} key={i} >
              <ScrabbleTile letter={c} score={scrabbleScore(c, [null], this.props.language)} modifier={this.props.word.modifiers[i]} />
            </WithModifierPopover>
          )}
        </div>
      </div>
    )
  }
}

class WithModifierPopover extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.state = {
      modifier: null,
      tooltipShown: false
    }
  }

  handleClick(modifier) {
    let modifierValue = (modifier === this.state.modifier) ? null : modifier
    this.setState({modifier: modifierValue, tooltipShown: false});
    this.props.onChange(modifierValue);
  }

  handleVisibilityChange(argument) {
    this.setState({tooltipShown: argument});
  }

  render() {
    /* DONE </div> indentation, and spaces before /> */
    return(
      <Tooltip onVisibilityChange={this.handleVisibilityChange}
               tooltipShown={this.state.tooltipShown}
               placement="bottom" trigger="click"
               tooltip={<div>
                          <ModifierTile modifier='double-letter' onClick={this.handleClick} />
                          <ModifierTile modifier='double-word'   onClick={this.handleClick} />
                          <ModifierTile modifier='triple-letter' onClick={this.handleClick} />
                          <ModifierTile modifier='triple-word'   onClick={this.handleClick} />
                          <ModifierTile modifier='blank'         onClick={this.handleClick} />
                        </div>
                       }>
        {this.props.children}
      </Tooltip>
    );
  }
}

class ModifierTile extends React.Component {
  tileText() {
    switch (this.props.modifier) {
      case 'double-letter':  return 'Double letter score';
      case 'double-word':    return 'Double word score';
      case 'triple-letter':  return 'Triple letter score';
      case 'triple-word':    return 'Triple word score';
      case 'blank':          return 'Blank tile';
      default:               return null;
    }
  }
  render() {
    return(
      <span onClick={() => this.props.onClick(this.props.modifier)} className={'modifier ' + this.props.modifier}>{this.tileText()}</span>
    )
  }
}

export default ScrabbleInputBox
