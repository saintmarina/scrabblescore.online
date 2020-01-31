import React from 'react';
import Tooltip from '../Tooltip/Tooltip';
import ModifierTile from './ModifierTile';
import { toggleModifiers } from '../../logic/util';

class WithModifierPopover extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.state = {
      modifiers: [],
      tooltipShown: false,
    };
  }

  handleClick(modifier, e) {
    const { modifiers } = this.state;
    const { onChange } = this.props;
    const newModifiers = toggleModifiers(modifiers, modifier);
    this.setState({ modifiers: newModifiers, tooltipShown: false });
    onChange(newModifiers);
    e.preventDefault();
    e.stopPropagation();
  }

  handleVisibilityChange(argument) {
    this.setState({ tooltipShown: argument });
  }

  render() {
    const { tooltipShown } = this.state;
    const { children } = this.props;
    return (
      <Tooltip
        onVisibilityChange={this.handleVisibilityChange}
        tooltipShown={tooltipShown}
        placement="bottom"
        trigger="click"
        portalContainer={document.getElementsByClassName('scrabble-input-box')[0]}
        tooltip={(
          <div>
          <div className="modifier-buttons">
            <ModifierTile modifier="double-letter" onClick={this.handleClick} />
            <ModifierTile modifier="double-word" onClick={this.handleClick} />
            <ModifierTile modifier="triple-letter" onClick={this.handleClick} />
            <ModifierTile modifier="triple-word" onClick={this.handleClick} />
            <ModifierTile modifier="blank" onClick={this.handleClick} />
          </div>
          <span className="star-hint">
            ↑ Press on the star
          </span>
          </div>
        )}
      >
        {children}
      </Tooltip>
    );
  }
}

export default WithModifierPopover;
