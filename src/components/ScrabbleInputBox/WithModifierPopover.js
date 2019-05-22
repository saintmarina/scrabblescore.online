import React from 'react';
import Tooltip from '../Tooltip/Tooltip';
import ModifierTile from './ModifierTile';

class WithModifierPopover extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.state = {
      modifier: null,
      tooltipShown: false,
    };
  }

  handleClick(modifiertype) {
    const { modifier } = this.state;
    const { onChange } = this.props;
    const modifierValue = (modifiertype === modifier) ? null : modifiertype;
    this.setState({ modifier: modifierValue, tooltipShown: false });
    onChange(modifierValue);
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
        tooltip={(
          <div>
            <ModifierTile modifier="double-letter" onClick={this.handleClick} />
            <ModifierTile modifier="double-word" onClick={this.handleClick} />
            <ModifierTile modifier="triple-letter" onClick={this.handleClick} />
            <ModifierTile modifier="triple-word" onClick={this.handleClick} />
            <ModifierTile modifier="blank" onClick={this.handleClick} />
          </div>
        )}
      >
        {children}
      </Tooltip>
    );
  }
}

export default WithModifierPopover;
