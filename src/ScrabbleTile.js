import React from 'react';

export default class ScrabbleTile extends React.Component {
  render() {
  	/* DONE props should only be letter and score */
    return (
      <span className={'scrabble-letter ' + this.props.modifier}>
        <span className='letter'>{this.props.letter.toUpperCase()}</span>
        <span className={'score'}>{this.props.score}</span>
      </span>
    )
  }
}