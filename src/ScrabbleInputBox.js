import React from 'react';
import {resizeArray, scrabbleScore} from './Util.js';
import Tooltip from './Tooltip.js';
import ScrabbleTile from './ScrabbleTile.js';

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

export class ScrabbleInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.textHiddenInput = React.createRef();
    this.handleReset = this.handleReset.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleHiddenInputChange = this.handleHiddenInputChange.bind(this);
    this.state = {
      inFocus: false,
      input: '',
      modifiers: []
    }
  }

  handleReset(){
    this.setState({ inFocus: false, input: '', modifiers: []})
  }

  handleClick() {
    this.textHiddenInput.current.focus();
    this.setState({inFocus: true});
  }

  handleHiddenInputChange(e) {
    let input = e.target.value;
    let result='';
    for (let i = 0; i < input.length; i++) {
      if (isLetter(input[i])) {
        result+=input[i];
      }
    }
    let modifiers = resizeArray(this.state.modifiers, result.length, null);
    this.setState({input: result, modifiers: modifiers});
  }

  handleModifierChange(letter_index, modifier) {
    let modifiers = this.state.modifiers.slice();
    modifiers = resizeArray(this.state.modifiers, this.state.input.length, null);
    modifiers[letter_index] = modifier;
    this.setState({modifiers: modifiers});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.input === prevState.input &&
        this.state.modifiers === prevState.modifiers)
      return;

    /* TODO rename wordObject */
    let wordObject = {
      value: this.state.input,
      modifiers: this.state.modifiers,
      score: scrabbleScore(this.state.input, this.state.modifiers)
    };
    this.props.onChange(wordObject);
  }

  render() {
    /* TODO take out the table="" props */
    return (
      <div onClick={this.handleClick} className={`scrabble-input-box${this.state.input.length > 6 ? ' large' : ''}`}>
        {this.state.inFocus && <div className='blinker'></div>}
        <input ref={this.textHiddenInput} onChange={this.handleHiddenInputChange} value={this.state.input}
               className='hidden-input' type='text' maxLength='15' autoComplete='off' /><br />
        <div className='scrabble-tiles'>
          {this.state.input.split('').map((c, i) =>
            <WithModifierPopover onChange={(modifier) => this.handleModifierChange(i, modifier)} key={i} >
              <ScrabbleTile letter={c} modifier={this.state.modifiers[i]} table=""/>
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
    this.Tooltip = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.state = {
      modifier: null,
      visibility: false
    }
  }

  handleClick(modifier) {
    let modifierValue = (modifier === this.state.modifier) ? null : modifier
    this.setState({modifier: modifierValue, visibility: false});
    this.props.onChange(modifierValue);
  }

  handleVisibilityChange(argument) {
    this.setState({visibility: argument});
  }

  render() {
    return(
    <Tooltip onVisibilityChange={this.handleVisibilityChange} tooltipShown={this.state.visibility} placement="bottom" trigger="click" tooltip={
              <div>
                <ModifierTile modifier='double-letter' onClick={this.handleClick}/>
                <ModifierTile modifier='double-word'   onClick={this.handleClick}/>
                <ModifierTile modifier='triple-letter' onClick={this.handleClick}/>
                <ModifierTile modifier='triple-word'   onClick={this.handleClick}/>
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
      default:               return null;
    }
  }
  render() {
    return(
      <span onClick={() => this.props.onClick(this.props.modifier)} className={'modifier ' + this.props.modifier}>{this.tileText()}</span>
    )
  }
}

export default ScrabbleInputBox;
