import React from 'react';
import { scrabbleScore } from '../../logic/util';
import ScrabbleInputBox from '../ScrabbleInputBox/ScrabbleInputBox';
import ReactGA from 'react-ga';

const emptyWord = { value: '', modifiers: [], score: 0 };

class InGameControls extends React.Component {
  

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleEndTurn = this.handleEndTurn.bind(this);
    this.handleEndGame = this.handleEndGame.bind(this);
    this.handleAddWord = this.handleAddWord.bind(this);
    this.handleBingo = this.handleBingo.bind(this);
    this._scrollInputToTheMiddle = this._scrollInputToTheMiddle.bind(this);
    this.input = React.createRef();
    this.state = {
      currentWord: emptyWord,
    };
  }

  _scrollInputToTheMiddle() {
    const { game, isMobile } = this.props;
    const elements = document.getElementsByClassName('add-word');
    const wordsOfFirstPlayerTurn = game.playersTurns[0][0].words;
    if (isMobile && elements.length !== 0 && wordsOfFirstPlayerTurn.length !== 0) 
      { elements[0].scrollIntoView({ block: 'center' }) }
  }

  componentDidMount() {
    if (this.input.current) this.input.current.focus();
  }

  onSetGame(game) {
    const { onSetGame } = this.props;
    onSetGame(game);
    this.resetCurrentWord();
  }

  resetCurrentWord() {
    this.setState({ currentWord: emptyWord });
    if (this.input.current) this.input.current.focus();
  }

  handleChange(word) {
    const { language } = this.props;
    const currentWord = { ...word, score: scrabbleScore(word.value, word.modifiers, language) };
    this.setState({ currentWord });
  }

  handleUndo() {
    const { onUndo } = this.props;
    onUndo();
    this.resetCurrentWord();
    this._scrollInputToTheMiddle();
    ReactGA.event({
      category: 'User',
      action: 'Clicked Undo'
    });
  }

  handleAddWord() {
    const { currentWord } = this.state;
    const { game } = this.props;
    this.onSetGame(game.addWord(currentWord));
    this._scrollInputToTheMiddle();

    ReactGA.event({
      category: 'User',
      action: 'Clicked AddWord'
    });
  }

  handleEndTurn(e) {
    const { currentWord } = this.state;
    let { game } = this.props;
    e.preventDefault(); /* prevent form submission */
    game = currentWord.value.length !== 0 ? game.addWord(currentWord) : game;
    this.onSetGame(game.endTurn());
    this._scrollInputToTheMiddle();

    ReactGA.event({
      category: 'User',
      action: 'Clicked EndTurn'
    });
  }

  handleBingo() {
    const { game, onSetGame } = this.props;
    onSetGame(game.setBingo(!game.getCurrentTurn().bingo));
    this._scrollInputToTheMiddle();

    ReactGA.event({
      category: 'User',
      action: 'Clicked Bingo'
    });
  }

  handleEndGame() {
    const { game, onSetGame } = this.props;
    onSetGame(game.endGame());
    this._scrollInputToTheMiddle();

    ReactGA.event({
      category: 'User',
      action: 'Clicked End Game'
    });
  }

  render() {
    const { currentWord } = this.state;
    const { game, language, undoDisabled } = this.props;
    const endTurnButtonText = game.getCurrentTurn().isEmpty() && currentWord.value === '' ? 'PASS' : 'END TURN';
    const isEndGameButtonDisabled = game.currentPlayerIndex !== 0 || currentWord.value !== '' || game.getCurrentTurn().score > 0 || game.playersTurns[game.getCurrentPlayerIndex()].length === 1;

    const props = {
      ref: this.input,
      onChange: this.handleChange,
      word: currentWord,
      language,
    };

    return (
      <form>
        <ScrabbleInputBox {...props} />
        <div className="buttons">
          <div className="in-game-controls">
            <div className="add-word-and-bingo-btns-container">
              <button onClick={this.handleAddWord} type="button" className="btn word-submit-button add-word" disabled={currentWord.value === ''}>+ ADD A WORD</button>
              <input onChange={this.handleBingo} type="checkbox" id="bingoToggle" checked={game.getCurrentTurn().bingo} />
              <label className="btn bingo" htmlFor="bingoToggle">
                <div className="bingo-toggle">BINGO</div>
              </label>
            </div>
            <div className="submit-btn-container">
              <button onClick={this.handleEndTurn} type="submit" className="btn pass-endturn-button">{endTurnButtonText}</button>
            </div>
            <div className="undo-and-end-game-btns-container">
              <button onClick={this.handleUndo} type="button" className="btn word-submit-button undo" disabled={undoDisabled}>UNDO</button>
              <button onClick={this.handleEndGame} type="button" className="btn end-game" disabled={isEndGameButtonDisabled}>END GAME</button>
            </div>
          </div>
        </div>
        <h3>How to use Scrabble Score Online:</h3>
        <ul>
          <li>
            If you are finished with your move, press END TURN to pass turn to the next player.
            Note: if there is something typed in the input box, it will be submitted to your move when the END TURN is pressed.
          </li>
          <li>
            If you have formed more than one word, type your first word in the input box, press ADD WORD.
            The word will be added to your move, but it still will be your turn and you can continue adding words.
            Note: you can add any number of words.
          </li>
          <li>
            If you played seven tiles on a turn, press BINGO.
            Note: This will add 50 points to your move.
          </li>
          <li>
            If some of your tiles fell on Premium Squares (e.g. double-word square), type the word in the input box, 
            click on the tile that is located on a Premium Square. Choose a desired option from the poped window.
            Note: if you need to use BLANK tile, follow the same instruction. Choose BLANK from the poped window.
          </li>
          <li>If you made a mistake, use unlimited UNDO.</li>
          <li>When you finished your game, press END GAME.</li>
        </ul>
      </form>
    );
  }
}
export default InGameControls;
