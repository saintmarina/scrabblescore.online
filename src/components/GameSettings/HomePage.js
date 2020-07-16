import React from 'react';

const HomePage = (props) => {
  return ( 
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <img id="big-logo" src="logo.png" alt="Scrabble score logo"/>
          <h1 style={{display:"none"}}>Scrabble Calculator</h1>
            <p>
               This Scrabble Score Calculator keeps track of the game, and replaces traditional pen-and-paper score sheets.
               Enjoy the game with your friends and family while this Scrabble Score Keeper does the math for you.
            </p>
            <p>
               Simply fill in the players’ names in order that they will
               take turns and press the START button.
            </p>
        </div>
      </div>
      <div className="language-choice-container">
        <p>Select the language:</p>
        <select className="custom-select" id="language-select" value={props.language} onChange={props.handleLangChange}>
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="fr">French</option>
        </select>
      </div>
      <div className="homepage-children">
      { props.children }
      </div>
      <div className="row">
        <div className="col-sm-12">
          <h5>Features</h5>
          <ul>
            <li>Supports official Scrabble scoring rules, including leftovers accounting</li>
            <li>Shows detailed game progress</li>
            <li>Supports unlimited undo</li>
            <li>Restores score sheets when relaunching the app</li>
          </ul>
          
          <h5>Limitations</h5>
          <ul>
            <li>Does not validate words against the Scrabble Dictionary</li>
            <li>Only supports the english language</li>
            <li>Does not archive score sheets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;