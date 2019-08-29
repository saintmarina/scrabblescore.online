import React from 'react';
import { scrabbleScore, logEvent, scrollToTop,  scrollToMiddle } from '../../logic/util';
import ScrabbleInputBox from '../ScrabbleInputBox/ScrabbleInputBox';

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
    this._scroll = this._scroll.bind(this);
    this.input = React.createRef();
    this.state = {
      currentWord: emptyWord,
    };
  }

  _scroll() {
    const { isMobile } = this.props;
    const { currentWord } = this.state;
    
    if (!isMobile) return 
    currentWord === emptyWord ? scrollToTop() : scrollToMiddle()
  }

  componentDidMount() {
    if (this.input.current) this.input.current.focus();
    this._scroll()
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
    this._scroll();

    logEvent('undo');
  }

  handleAddWord() {
    const { currentWord } = this.state;
    const { game } = this.props;
    this.onSetGame(game.addWord(currentWord));
    this._scroll();

    logEvent('add-word', {'word': currentWord});
  }

  handleEndTurn(e) {
    const { currentWord } = this.state;
    let { game } = this.props;
    e.preventDefault(); /* prevent form submission */
    game = currentWord.value.length !== 0 ? game.addWord(currentWord) : game;
    this.onSetGame(game.endTurn());
    this._scroll();

    const data = currentWord.value.length !== 0
                        ? {'word': currentWord}
                        : {};
    logEvent('end-turn', data);
  }

  handleBingo() {
    const { game, onSetGame } = this.props;
    onSetGame(game.setBingo(!game.getCurrentTurn().bingo));
    this._scroll();

    logEvent('toggle-bingo');
  }

  handleEndGame() {
    const { game, onSetGame } = this.props;
    onSetGame(game.endGame());
    this._scroll();

    logEvent('end-game', {'num-of-turns': game.playersTurns.length,
                          'game-turns': game.playersTurns.map((turns) => ({turns: turns}))});
  }

  render() {
    const { currentWord } = this.state;
    const { game, language, undoDisabled } = this.props;
    const isCurrentWordEmpty = game.getCurrentTurn().isEmpty() && currentWord.value === ''
    const endTurnButtonText = isCurrentWordEmpty ? 'PASS' : 'END TURN';
    const isEndGameDisabled = game.currentPlayerIndex !== 0 || currentWord.value !== '' || game.getCurrentTurn().score > 0 || game.playersTurns[game.getCurrentPlayerIndex()].length === 1;
    const isBingoDisabled = ![...game.getCurrentTurn().words, currentWord].some( word => word.value.length >= 7 )

    const isModifierChosen = currentWord.modifiers.some(modifier => modifier !== null);
    const isInstructionShown = game.getCurrentTurnNumber() === 0 && game.getCurrentPlayerIndex() === 0 && !isModifierChosen && currentWord.value !== ''
    const isFirstTurn = game.getCurrentTurnNumber() === 0 && game.getCurrentPlayerIndex() === 0
    const isEndTurnDisabled = !isModifierChosen && !isCurrentWordEmpty && isFirstTurn;
    const props = {
      ref: this.input,
      onChange: this.handleChange,
      word: currentWord,
      language,
    };

    return (
      <form className={isFirstTurn ? 'first-turn' : null}>
        <ScrabbleInputBox {...props} />
        <div className={`instruction-message ${isInstructionShown ? "" : "hide"}`}> 
          Click on the tile that is on the double word prime square
        </div>

        <div className="buttons">
         <div className="row">
            <div className="col">
              <button onClick={this.handleEndTurn} type="submit" className="btn pass-endturn-button" disabled={isEndTurnDisabled}>{endTurnButtonText}</button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button onClick={this.handleAddWord} type="button" className="btn word-submit-button add-word" disabled={currentWord.value === '' || isFirstTurn}>+ ADD A WORD</button>
            </div>
            <div className="col">
              <input onChange={this.handleBingo} type="checkbox" id="bingoToggle" checked={game.getCurrentTurn().bingo} disabled={isBingoDisabled}/>
              <label className={`btn bingo ${isBingoDisabled ? "disabled" : ""}`} htmlFor="bingoToggle">
                BINGO
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button onClick={this.handleUndo} type="button" className="btn word-submit-button undo" disabled={undoDisabled}>UNDO</button>
            </div>
            <div className="col">
              <button onClick={this.handleEndGame} type="button" className="btn end-game" disabled={isEndGameDisabled}>END GAME</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default InGameControls;
