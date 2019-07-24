import React from 'react';

function CallPlayerToAction(props) {
  const { isMobile, game, playerNames } = props;
  const callPlayerToAction = isMobile ? `Submit ${!game.isGameOver()
    ? 'a word or end turn'
    : 'your leftovers'}`
    : `${playerNames[game.currentPlayerIndex]}, submit ${!game.isGameOver()
      ? 'a word or end turn'
      : 'your leftovers'}`;

  return (
    <div className="row justify-content-center">
      <span className="call-player-to-action">{callPlayerToAction}</span>
    </div>
  );
}

export default CallPlayerToAction;
