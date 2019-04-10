import React from 'react';

export default class ScrabbleTile extends React.Component {
  render() {
    return (
      <span className={'scrabble-letter ' + this.props.modifier}>
        <span className='letter'>{this.props.letter.toUpperCase()}</span>
        <span className={'score'}>{this.props.score}</span>
      </span>
    )
  }
}