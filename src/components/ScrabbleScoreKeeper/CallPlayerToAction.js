import React from 'react';

class CallPlayerToAction extends React.Component {
  render () {
    const { game, playerNames, isMobile } = this.props;
    const callPlayerToAction = isMobile ? `Submit ${!game.isGameOver()
                                          ? 'a word or end turn'
                                          : 'your leftovers'}`
                                        : `${playerNames[game.currentPlayerIndex]}, submit ${!game.isGameOver()
                                          ? 'a word or end turn'
                                          : 'your leftovers'}`

    return (
      <div className="row justify-content-center">
        <span className="call-player-to-action">{callPlayerToAction}</span>
      </div> 
    )
  }
}

export default CallPlayerToAction;