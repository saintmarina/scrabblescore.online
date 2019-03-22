import React from 'react';
import {resizeArray, scrabbleScore} from './Util.js';
import Tooltip from './Tooltip.js';

const letterScoreMap = { a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, r: 1, s: 1,
t: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4,
k: 5, j: 8, x: 8, q: 10, z: 10, };

class ScrabbleInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.textHiddenInput = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleHiddenInputChange = this.handleHiddenInputChange.bind(this);
    this.state = {
      inFocus: false,
      input: '',
      modifiers: []
    }
  }

  handleClick() {
    this.textHiddenInput.current.focus();
    this.setState({inFocus: true});
  }

  handleHiddenInputChange(e) {
    let input = e.target.value;
    let modifiers = resizeArray(this.state.modifiers, input.length, null);
    this.setState({input: input, modifiers: modifiers});
  }

  handleModifierChange(letter_index, modifier) {
    let modifiers = this.state.modifiers.slice();
    modifiers = resizeArray(this.state.modifiers, this.state.input.length, null);
    modifiers[letter_index] = modifier;
    this.setState({modifiers: modifiers});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.input == prevState.input &&
        this.state.modifiers == prevState.modifiers)
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
    return (
      <div onClick={this.handleClick} className={`scrabble-input-box${this.state.input.length > 6 ? ' large' : ''}`}>
        {this.state.inFocus && <div className='blinker'></div>}
        <input ref={this.textHiddenInput} onChange={this.handleHiddenInputChange} value={this.state.input}
               className='hidden-input' type='text' maxLength='30' autoComplete='off' /><br />
        <div className='scrabble-tiles'>
          {this.state.input.split('').map((c, i) =>
            <WithModifierPopover onChange={(modifier) => this.handleModifierChange(i, modifier)} key={i} >
              <ScrabbleTile letter={c}/>
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
    switch(this.props.modifier) {
      case 'double-letter':
        return'Double letter score';
      case 'double-word':
        return 'Double word score';
      case 'triple-letter':
        return 'Triple letter score';
      case 'triple-word':
        return 'Triple word score';
      default:
        return 'Scrabble tile'
    }
  }
  render() {
    return(
      <span onClick={() => this.props.onClick(this.props.modifier)} className={'modifier ' + this.props.modifier}>{this.tileText()}</span>
    )
  }
}

class ScrabbleTile extends React.Component{
  get score() {
    return letterScoreMap[this.props.letter];
  }

  render() {
    return (
      <span className='scrabble-letter'>
        <span className='letter'>{this.props.letter.toUpperCase()}</span>
        <span className='score'>{this.score}</span>
      </span>
    )
  }
}

export default ScrabbleInputBox;
