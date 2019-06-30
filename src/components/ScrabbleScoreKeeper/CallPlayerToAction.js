import React from 'react';

class CallPlayerToAction extends React.Component {
  render () {
    const { game, playerNames, isMobile } = this.props;
    const callPlayerToAction = isMobile ? `Submit ${!game.isGameOver()
                                          ? 'a word'
                                          : 'your leftovers'}`
                                        : `${playerNames[game.currentPlayerIndex]}, submit ${!game.isGameOver()
                                          ? 'a word'
                                          : 'your leftovers'}`

    return <span className="call-player-to-action">{callPlayerToAction}</span>;
  }
}

export default CallPlayerToAction;