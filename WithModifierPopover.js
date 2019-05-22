import React from "react";
import Tooltip from "../Tooltip/Tooltip";
import ModifierTile from './ModifierTile';

class WithModifierPopover extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.state = {
      modifier: null,
      tooltipShown: false
    }
  }

  handleClick(modifier) {
    let modifierValue = (modifier === this.state.modifier) ? null : modifier
    this.setState({modifier: modifierValue, tooltipShown: false});
    this.props.onChange(modifierValue);
  }

  handleVisibilityChange(argument) {
    this.setState({tooltipShown: argument});
  }

  render() {
    return(
      <Tooltip 
        onVisibilityChange={this.handleVisibilityChange}
        tooltipShown={this.state.tooltipShown}
        placement="bottom" trigger="click"
        tooltip={<div>
                  <ModifierTile modifier="double-letter" onClick={this.handleClick} />
                  <ModifierTile modifier="double-word"   onClick={this.handleClick} />
                  <ModifierTile modifier="triple-letter" onClick={this.handleClick} />
                  <ModifierTile modifier="triple-word"   onClick={this.handleClick} />
                  <ModifierTile modifier="blank"         onClick={this.handleClick} />
                </div>
                }
      >
        {this.props.children}
      </Tooltip>
    );
  }
}

export default WithModifierPopover;