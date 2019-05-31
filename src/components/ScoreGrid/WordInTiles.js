import React from 'react';
import { scrabbleScore } from '../../logic/util';
import ScrabbleTile from '../ScrabbleTile/ScrabbleTile';

class WordInTiles extends React.Component {
  render() {
    const { word, language } = this.props;
    const letterTiles = word.value.split('').map((letter, i) => {
      let tile = (
        <ScrabbleTile
          key={i}
          letter={letter}
          modifier={word.modifiers[i]}
          score={scrabbleScore(letter, [null], language)}
        />
      );
      return tile;
    });
    return <div>{letterTiles}</div>;
  }
}

export default WordInTiles;
