import React from 'react';
import PlayerPicker from './PlayerPicker.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';

const debug = true;

class Section3 extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      currentPlayerIndex: 0,
      currentMove: 1,
      players: [
        {name: "Anna", wordHistory: [{word:'word', score: 8, modifiers: []}, {word: 'leaf', score: 9, modifiers: []}]},
        {name: "Nico", wordHistory: [{word:'rose', score: 6, modifiers: []}]}
      ]
    }
  }

  handleChange(currentPlayerTurn, value, modifiers) {
    let players = this.state.players.slice();
    players[currentPlayerTurn].wordHistory[this.state.currentMove - 1].word = value;
    players[currentPlayerTurn].wordHistory[this.state.currentMove - 1].modifiers = modifiers;
    this.setState({players: players});
  }

  render() {
    return (
      <div className='section3'>
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
        <div>
          <br />
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox  onChange={(value, modifier) => this.handleChange(1, value, modifier)}/>
          <button type="submit" className="btn btn-info word-submit-button">Submit</button>     <br /><br />
        </div>
        <div className="row justify-content-center">
        </div>
        <br />
        <ScoreGrid currentMove={this.state.currentMove} players={this.state.players} />
      </div>
    )
  }
}


class ScoreGrid extends React.Component {
  render() {
    return (
      <table id='score-table' className="table table-bordered" align="center">
          <thead>
            <tr className="thead-rows">
              <th id="move">Move</th>
              {this.props.players.map((player, i) =>
              <th key={i} className="player-header">{player.name}</th>)}
            </tr>
          </thead>
          <tbody className="tbody-rows">
          {[...Array(this.props.currentMove + 1)].map((_, i) =>
            <tr key={i}>
              <th>{i+1}</th>
              {this.props.players.map((player, j) =>
                <td key={j}>{player.wordHistory[i] ? <ScoreGridCell word={player.wordHistory[i]}/> : null}</td> )}
            </tr> )}
          </tbody>
        </table>
    )
  }
}

class ScoreGridCell extends React.Component {
  render() {
    return (
      <span>{this.props.word.word}<div className='score-box'>{this.props.word.score}</div></span>
    )
  }
}

class App extends React.Component {
  state = debug ? {
    currentSection: 3,
    playerNames: ['Anna', 'Nico']
  } :
  {
    currentSection: 1,
    playerNames: []
  }

  handleSectionChange(sectionNumber) {
    this.setState({currentSection: sectionNumber});
  }

  handlePlayerChange(playerNames) {
    this.setState({playerNames: playerNames});
  }
  section(currentSection) {
    if(currentSection === 1 || currentSection ===  2) {
      return <PlayerPicker currentSection={this.state.currentSection} onSectionChange = {this.handleSectionChange.bind(this)}
                        onPlayerChange={this.handlePlayerChange.bind(this)} />
    } else if (currentSection === 3) {
      return <Section3 playerNames={this.state.playerNames} />
    }
  }
  render() {
    return (
      <div className='main'>
        <h1> Scrabble score keeper</h1>
        <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        {this.section(this.state.currentSection)}
      </div>
    );
  }
}

export default App;

/*

X First commit the code

X 1) Do a popover including all the logic
     X Use the WithModifierPopover. It should have a handleModifierChange prop that is passed down to the ModifierTile children.
     X ModifierTile should be a componentn that renders differently depending on this.props.modifier
     X To hide the popover once clicking on the modifier tile, use the tooltipShown / onVisibilyChange props (https://github.com/mohsinulhaq/react-popper-tooltip)
     X Style as as square

X 2) When we click on the same modifier it should turn off the modifier.

3) X  ScrableInputBox should have an onChange prop to pass the word = {'value': "anna", "modifiers": [...]} to its parent
   X Put ScrabbleInputBox in its own file

4) Make a new component "PlayerPicker"
    X Think about how data should flow with its Parent
    X It should have Section1 and Section2 as children
    X Section1 and Section2 should be renamed to something more appropriate
    X Section{1,2} should not be expoted
    X util.js should contain the resizeArray function and export it

5) Have ScrabbleTile display its modifier underneath through a prop. It should reuse the ModifierTile component (but without an onClick callback).

*/