import React from "react";
import {resizeArray, scrabbleScore, isLetterAllowed} from "../logic/util";
import Tooltip from "./Tooltip";
import ScrabbleTile from "./ScrabbleTile";
import "./ScrabbleInputBox.css";

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
    const { language, word, onChange} = this.props;
    let input = e.target.value;
    let result = input.split("").map(letter => isLetterAllowed(letter, language) ? letter : "");
    let modifiers = resizeArray(word.modifiers, result.length, null);
    onChange({value: result.join(""), modifiers: modifiers})
  }

  handleModifierChange(letterIndex, modifier) {
    const { word, onChange} = this.props;
    let modifiers = word.modifiers.slice();
    modifiers[letterIndex] = modifier;
    onChange({value: word.value, modifiers: modifiers})
  }

  focus() {
    this.textHiddenInput.current.focus()
  }

  render() {
    const { language, word } = this.props;
    return (
      <div onClick={this.focus} className={`scrabble-input-box${word.value.length > 6 ? " large" : ""}`}>
        <input ref={this.textHiddenInput} onChange={this.handleHiddenInputChange} value={word.value}
               className="hidden-input" onBlur={() => this.setState({inFocus: false})} onFocus={() => this.setState({inFocus: true})}
               type="text" maxLength="15" autoComplete="off" autoCapitalize="off" spellCheck="false" autoCorrect="off" />
        <div className={this.state.inFocus ? "scrabble-tiles blinker" : "scrabble-tiles"}>
          {word.value.split("").map((c, i) =>
            <WithModifierPopover onChange={(modifier) => this.handleModifierChange(i, modifier)} key={i} >
              <ScrabbleTile letter={c} score={scrabbleScore(c, [null], language)} modifier={word.modifiers[i]} />
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
    return(
      <Tooltip 
        onVisibilityChange={this.handleVisibilityChange}
        tooltipShown={this.state.tooltipShown}
        placement="bottom" trigger="click"
        tooltip={<div>
                  <ModifierTile modifier="double-letter" onClick={this.handleClick} />
                  <ModifierTile modifier="double-word"   onClick={this.handleClick} />
                  <ModifierTile modifier="triple-letter" onClick={this.handleClick} />
                  <ModifierTile modifier="triple-word"   onClick={this.handleClick} />
                  <ModifierTile modifier="blank"         onClick={this.handleClick} />
                </div>
                }
      >
        {this.props.children}
      </Tooltip>
    );
  }
}

class ModifierTile extends React.Component {
  tileText() {
    switch (this.props.modifier) {
      case "double-letter":  return "Double letter score";
      case "double-word":    return "Double word score";
      case "triple-letter":  return "Triple letter score";
      case "triple-word":    return "Triple word score";
      case "blank":          return "Blank tile";
      default:               return null;
    }
  }
  render() {
    const { onClick, modifier } = this.props;
    return(
      <span onClick={() => onClick(modifier)} onTouchStart={() => onClick(modifier)} className={"modifier " + modifier}>
        {this.tileText()}
      </span>
    )
  }
}

export default ScrabbleInputBox
