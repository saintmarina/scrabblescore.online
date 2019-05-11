import React from "react";
import "./ScrabbleTile.css";

export default class ScrabbleTile extends React.Component {
  render() {
  	const { modifier, letter, score } = this.props;
  	const modifierClass = modifier === null ? "" : modifier
    return (
      <span className={"scrabble-letter " + modifierClass}>
        <span className="letter">{letter.toUpperCase()}</span>
        <span className={"score"}>{score}</span>
      </span>
    )
  }
}