import React from 'react';
import { scrabbleScore } from '../../logic/util';
import ScrabbleTile from '../ScrabbleTile/ScrabbleTile';

class WordInTiles extends React.Component {
  render() {
    const { word, language } = this.props;
    if (word.value === '__reaped_leftovers__') {
      return <span className='reaper'>NO LEFTOVERS</span>
    } 
    const letterTiles = word.value.split('').map((letter, i) => {
      const tile = (
        <ScrabbleTile
          key={i}
          letter={letter}
          modifier={word.modifiers[i]}
          score={scrabbleScore(letter, [[]], language)}
        />
      );
      return tile;
    });
    return <div>{letterTiles}</div>;
  }
}

export default WordInTiles;
