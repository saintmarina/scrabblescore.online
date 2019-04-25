import React from 'react';

export default class ScrabbleTile extends React.Component {
  render() {
  	const modifierClass = this.props.modifier === null ? '' : this.props.modifier
    return (
      <span className={'scrabble-letter ' + modifierClass}>
        <span className='letter'>{this.props.letter.toUpperCase()}</span>
        <span className={'score'}>{this.props.score}</span>
      </span>
    )
  }
}