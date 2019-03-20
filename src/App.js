import React from 'react';
import {Section1, Section2} from './PlayerPicker.js';
import Tooltip from './Tooltip.js'

const debug = true;

const letterScoreMap = { a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, r: 1, s: 1,
t: 1, d: 2, g: 2, b: 3, c: 3, m: 3, p: 3, f: 4, h: 4, v: 4, w: 4, y: 4,
k: 5, j: 8, x: 8, q: 10, z: 10, };


function resizeArray(array, desiredLength, defaultValue) {
  let output = array.slice(0, desiredLength);
  while (output.length < desiredLength)
    output.push(defaultValue);
  return output;
}



class Section3 extends React.Component {
  state = {
    currentPlayerIndex: 0,
    currentMove: 1,
    players: [
      {name: "Anna", wordHistory: [{word:'word', score: 8, modifiers: []}, {word: 'leaf', score: 9, modifiers: []}]},
      {name: "Nico", wordHistory: [{word:'rose', score: 6, modifiers: []}]}
    ]
  }

  render() {
    return (
      <div className='section3'>
        <img id="logo" src="/scrabble_upper.jpg" className="img-fluid rounded" alt="A scrabble game." width='750' height='200'/>
        <div>
          <br />
          <p className="bold">Submit a word:</p>
          <ScrabbleInputBox  />
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

class ScrabbleInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.textHiddenInput = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleHiddenInputChange = this.handleHiddenInputChange.bind(this);
    this.state = {
      inFocus: false,
      input: 'anna',
      modifiers: [null, null, null, null]
    }
  }

  handleClick() {
    this.textHiddenInput.current.focus();
    this.setState({inFocus: true});
  }

  handleHiddenInputChange(e) {
    let input = e.target.value;
    let modifiers = resizeArray(this.state.modifiers, input.length, null);
    this.setState({input: input, modifiers: modifiers});
  }

  handleModifierChange(letter_index, modifier) {
    let modifiers = this.state.modifiers.slice();
    modifiers[letter_index] = modifier;
    this.setState({modifiers: modifiers});
  }

  render() {
    return (
      <div onClick={this.handleClick} className={`scrabble-input-box${this.state.input.length > 6 ? ' large' : ''}`}>
        {this.state.inFocus && <div className='blinker'></div>}
        <input ref={this.textHiddenInput} onChange={this.handleHiddenInputChange} value={this.state.input}
               className='hidden-input' type='text' maxLength='30' autoComplete='off' /><br />
        <div className='scrabble-tiles'>
          {this.state.input.split('').map((c, i) =>
            <WithModifierPopover onChange={(modifier) => this.handleModifierChange(i, modifier)} key={i} >
              <ScrabbleTile letter={c}/>
            </WithModifierPopover>
          )}
        </div>
      </div>
    )
  }
}

class WithModifierPopover extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      modifier: null
    }
  }

  handleClick(modifier) {
    this.setState({modifier: modifier});
    this.props.onChange(modifier);
  }
  render() {
    return(
    <Tooltip placement="bottom" trigger="click" tooltip={
              <div>
                <ModifierTile modifier='double-letter' onClick={this.handleClick}/>
                <ModifierTile modifier='double-word'   onClick={this.handleClick}/>
                <ModifierTile modifier='triple-letter' onClick={this.handleClick}/>
                <ModifierTile modifier='triple-word'   onClick={this.handleClick}/>
               </div>
            }>
      {this.props.children}
    </Tooltip>
    );
  }
}

class ModifierTile extends React.Component {
  tileText() {
    switch(this.props.modifier) {
      case 'double-letter':
        return'Double letter score';
      case 'double-word':
        return 'Double word score';
      case 'triple-letter':
        return 'Triple letter score';
      case 'triple-word':
        return 'Triple word score';
    }
  }
  render() {
    return(
      <span onClick={() => this.props.onClick(this.props.modifier)} className={'modifier ' + this.props.modifier}>{this.tileText()}</span>
    )
  }
}

class ScrabbleTile extends React.Component{
  get score() {
    return letterScoreMap[this.props.letter];
  }

  render() {
    return (
      <span className='scrabble-letter'>
        <span className='letter'>{this.props.letter.toUpperCase()}</span>
        <span className='score'>{this.score}</span>
      </span>
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
    numberOfPlayers: 2,
    playerNames: ["Anna", "Nico"]
  } :
  {
    currentSection: 1,
    numberOfPlayers: 2,
    playerNames: []
  }

  handleSection1Next(target) {
    this.setState({currentSection: 2, numberOfPlayers: target.state.numberOfPlayers});
  }

  handleSection2Back(target) {
    this.setState({currentSection: 1, playerNames: target.playerNames});
  }

  handleSection2Next(target) {
    this.setState({currentSection: 3, playerNames: target.playerNames});
  }

  getDefaultPlayerNames() {
    return resizeArray(this.state.playerNames, this.state.numberOfPlayers, '');
  }

  render() {
    return (
      <div className='main'>
        <h1> Scrabble score keeper</h1>
        <p>Counting points when playing Scrabble can be tedious and sometimes riddled with mistakes.
        Scrabble score keeper is a simple tool, that helps Scrabble players to count the score in an 
        innovative and easy way, whilst playing the Scrabble board game.</p>
        {this.state.currentSection === 1 ?
          <Section1 onNext={this.handleSection1Next.bind(this)} defaultNumberOfPlayers={this.state.numberOfPlayers} /> :
         this.state.currentSection === 2 ?
          <Section2 onBack={this.handleSection2Back.bind(this)} onNext={this.handleSection2Next.bind(this)}
                    defaultNames={this.getDefaultPlayerNames()}/> :
          this.state.currentSection === 3 ?
          <Section3 playerNames={this.state.playerNames}/> : null
        }
      </div>
    );
  }
}

export default App;

/*

First commit the code

1) Do a popover including all the logic
     X Use the WithModifierPopover. It should have a handleModifierChange prop that is passed down to the ModifierTile children.
     X ModifierTile should be a componentn that renders differently depending on this.props.modifier
     - To hide the popover once clicking on the modifier tile, use the tooltipShown / onVisibilyChange props (https://github.com/mohsinulhaq/react-popper-tooltip)
     - Style as as square

2) When we click on the same modifier it should turn off the modifier.

3) ScrableInputBox should have an onChange prop to pass the word = {'value': "anna", "modifiers": [...]} to its parent
Put ScrabbleInputBox in its own file

4) Make a new component "PlayerPicker"
    - Think about how data should flow with its Parent
    - It should have Section1 and Section2 as children
    - Section1 and Section2 should be renamed to something more appropriate
    - Section{1,2} should not be expoted
    - util.js should contain the resizeArray function and export it

5) Have ScrabbleTile display its modifier underneath through a prop. It should reuse the ModifierTile component (but without an onClick callback).

*/