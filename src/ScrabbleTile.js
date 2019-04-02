import React from 'react';
import {scrabbleScore} from './Util.js';

export default class ScrabbleTile extends React.Component {
  render() {
    return (
      <span className={'scrabble-letter ' + this.props.modifier}>
        <span className={'letter'}>{this.props.letter.toUpperCase()}</span>
        <span className={'score'}>{scrabbleScore(this.props.letter, [null])}</span>
      </span>
    )
  }
}