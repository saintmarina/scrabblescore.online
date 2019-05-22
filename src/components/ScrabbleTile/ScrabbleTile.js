import React from 'react';
import './ScrabbleTile.css';

function ScrabbleTile(props) {
  const { modifier, letter, score } = props;
  const modifierClass = modifier === null ? '' : modifier;
  return (
    <span className={`scrabble-letter ${modifierClass}`}>
      <span className="letter">{letter.toUpperCase()}</span>
      <span className="score">{score}</span>
    </span>
  );
}
export default ScrabbleTile;
