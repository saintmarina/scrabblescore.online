import React from 'react';

class ModifierTile extends React.Component {
  tileText() {
    const { modifier } = this.props;
    switch (modifier) {
      case 'double-letter': return 'Double letter score';
      case 'double-word': return 'Double word score';
      case 'triple-letter': return 'Triple letter score';
      case 'triple-word': return 'Triple word score';
      case 'blank': return 'Blank tile';
      default: return null;
    }
  }

  render() {
    const { onClick, modifier } = this.props;
    return (
      <span
        role="button"
        onClick={() => onClick(modifier)}
        onKeyDown={() => onClick(modifier)}
        onTouchStart={() => onClick(modifier)}
        className={`modifier ${modifier}`}
      >
        {this.tileText()}
      </span>
    );
  }
}

export default ModifierTile;
