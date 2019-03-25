import React from 'react';

const letterScoreMap = { a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, r: 1, s: 1,
t: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4,
k: 5, j: 8, x: 8, q: 10, z: 10, };

export default class ScrabbleTile extends React.Component{
  state = {
    modifier: null,
  }

  get score() {
    return letterScoreMap[this.props.letter];
  }
  setClass() {
    switch (this.props.modifier) {
      case 'double-letter':
        return 'scrabble-letter double-letter';
      case 'double-word':
        return 'scrabble-letter double-word';
      case 'triple-letter':
        return 'scrabble-letter triple-letter';
      case 'triple-word':
        return 'scrabble-letter triple-word';
      default:
        return 'scrabble-letter';
    }
  }
  render() {
    return (
      <span className={'scrabble-letter ' + this.props.modifier + this.props.table}>
        <span className={'letter' + this.props.table}>{this.props.letter.toUpperCase()}</span>
        <span className={'score' + this.props.table}>{this.score}</span>
      </span>
    )
  }
}