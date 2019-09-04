import React from 'react';
import './ScrabbleTile.css';

function ScrabbleTile(props) {
  const {
    modifier, letter, score, onClick,
  } = props;
  const modifierClass = modifier === [] ? '' : modifier.join(' ');
  return (
    <span className={`scrabble-letter ${modifierClass}`} role="button" onClick={onClick} onKeyDown={onClick}>
      {modifier.length !== 0
        ? <span className="tile-modifier"></span>
        : null
      }
      <span className="letter">{letter.toUpperCase()}</span>
      <span className="score">{score}</span>
    </span>
  );
}
export default ScrabbleTile;
