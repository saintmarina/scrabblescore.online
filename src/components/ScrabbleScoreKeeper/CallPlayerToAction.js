import React from 'react';

function CallPlayerToAction(props) {
  const { isMobile, game, playerNames } = props;
  
  function callPlayerToAction() {
    const playerName = playerNames[game.currentPlayerIndex];
    const msgs = {
      'mobile-ingame':    `Submit a word or pass`,
      'mobile-gameover':  `Submit your leftovers`,
      'desktop-ingame':   `${playerName}, submit a word or pass`,
      'desktop-gameover': `${playerName}, submit your leftovers`,
    };
    return msgs[`${isMobile ? 'mobile' : 'desktop'}-${game.isGameOver() ? 'gameover':'ingame'}`];
  }

  return (
    <div className="row justify-content-center">
      <span className="call-player-to-action">{callPlayerToAction()}</span>
    </div>
  );
}

export default CallPlayerToAction;
