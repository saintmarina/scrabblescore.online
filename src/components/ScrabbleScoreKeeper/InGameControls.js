import React from 'react';
import { scrabbleScore } from '../../logic/util';
import ScrabbleInputBox from '../ScrabbleInputBox/ScrabbleInputBox';
import CurrentScore from './CurrentScore';

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
    this.input = React.createRef();
    this.state = {
      currentWord: emptyWord,
    };
  }

  componentDidMount() {
    this.input.current.focus();
  }

  onSetGame(game) {
    const { onSetGame } = this.props;
    onSetGame(game);
    this.resetCurrentWord();
  }

  resetCurrentWord() {
    this.setState({ currentWord: emptyWord });
    this.input.current.focus();
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
  }

  handleAddWord() {
    const { currentWord } = this.state;
    const { game } = this.props;
    this.onSetGame(game.addWord(currentWord));
  }

  handleEndTurn(e) {
    const { currentWord } = this.state;
    let { game } = this.props;
    e.preventDefault(); /* prevent form submission */
    game = currentWord.value.length !== 0 ? game.addWord(currentWord) : game;
    this.onSetGame(game.endTurn());
  }

  handleBingo() {
    const { game, onSetGame } = this.props;
    onSetGame(game.setBingo(!game.getCurrentTurn().bingo));
  }

  handleEndGame() {
    const { game, onSetGame } = this.props;
    onSetGame(game.endGame());
  }

  render() {
    const { currentWord } = this.state;
    const { game, language, undoDisabled } = this.props;
    const endTurnButtonText = game.getCurrentTurn().isEmpty() && currentWord.value === '' ? 'PASS' : 'END TURN';
    const isEndGameButtonDisabled = game.currentPlayerIndex !== 0 || currentWord.value !== '' || game.getCurrentTurn().score > 0;
    const props = {
      ref: this.input,
      onChange: this.handleChange,
      word: currentWord,
      language,
    };
    return (
      <form autoComplete="off">
        <ScrabbleInputBox {...props} />
        <CurrentScore score={currentWord.score} />
        <div>
        <div>
          <button onClick={this.handleAddWord} type="button" className="btn btn-info word-submit-button" disabled={currentWord.value === ''}>+ ADD A WORD</button>
          <div className="custom-control custom-switch">
            <input onChange={this.handleBingo} type="checkbox" className="custom-control-input" id="bingoToggle" checked={game.getCurrentTurn().bingo} />
            <label className="custom-control-label" htmlFor="bingoToggle">BINGO</label>
          </div>
        </div>
        <div>
          <button onClick={this.handleEndTurn} type="submit" className="btn btn-info pass-endturn-button">{endTurnButtonText}</button>
        </div>
          <button onClick={this.handleUndo} type="button" className="btn btn-info word-submit-button" disabled={undoDisabled}>UNDO</button>
          <button onClick={this.handleEndGame} type="button" className="btn btn-danger end-game" disabled={isEndGameButtonDisabled}>END GAME</button>
        </div>
      </form>
    );
  }
}
export default InGameControls;
