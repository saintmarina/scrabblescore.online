import React from 'react';

function CallPlayerToAction(props) {
  const { isMobile, game, playerNames } = props;
  
  function callPlayerToAction() {
    const firstPart = isMobile
      ? 'Submit '
      : `${playerNames[game.currentPlayerIndex]}, submit `
    const secondPart = !game.isGameOver()
        ? 'a word or end turn'
        : 'your leftovers'
    return firstPart + secondPart
  }

  return (
    <div className="row justify-content-center">
      <span className="call-player-to-action">{callPlayerToAction()}</span>
    </div>
  );
}

export default CallPlayerToAction;
