import React from 'react';
import { scrabbleScore } from '../../logic/util';
import ScrabbleInputBox from '../ScrabbleInputBox/ScrabbleInputBox';

const emptyWord = { value: '', modifiers: [], score: 0 };

class InGameOverControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleLeftOvers = this.handleLeftOvers.bind(this);
    this.input = React.createRef();
    this.state = {
      currentWord: emptyWord,
    };
  }

  componentDidMount() {
    if (this.input.current) this.input.current.focus();
  }

  resetCurrentWord() {
    this.setState({ currentWord: emptyWord });
    if (this.input.current) this.input.current.focus();
  }

  handleUndo() {
    const { onUndo } = this.props;
    onUndo();
    this.resetCurrentWord();
  }

  handleChange(word) {
    const { language } = this.props;
    const currentWord = { ...word, score: -scrabbleScore(word.value, word.modifiers, language) };
    this.setState({ currentWord });
  }

  handleLeftOvers(e) {
    const { currentWord } = this.state;
    let { game, onSetGame } = this.props;
    e.preventDefault(); /* prevent form submission */

    if (currentWord.value.length !== 0)
      game = game.addWord(currentWord);
    game = game.endTurn();

    if (game.currentPlayerIndex === 0)
      game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers())

    onSetGame(game);
    this.resetCurrentWord();
  }

  render() {
    const { currentWord } = this.state;
    const { game, language, undoDisabled } = this.props;
    const submitButtonText = currentWord.value.length > 0 ? 'SUBMIT LEFTOVERS' : 'SUBMIT NO LEFTOVERS';
    return (
      <div>
        {!game.areLeftOversSubmitted()
          ? (
            <form autoComplete="off">
              <ScrabbleInputBox
                ref={this.input}
                onChange={this.handleChange}
                word={currentWord}
                language={language}
              />
              <div className="buttons">
                <div className="in-game-controls">
                  <div className="undo-and-end-game-btns-container">
                    <button onClick={this.handleLeftOvers} type="submit" className="btn pass-endturn-button">{submitButtonText}</button>
                  </div>
                  <div className="submit-btn-container">
                    <button onClick={this.handleUndo} type="button" className="btn word-submit-button undo" disabled={undoDisabled}>UNDO</button>
                  </div>
                </div>
              </div>
            </form>
          )
          : (
            <div className="buttons">
              <div className="in-game-controls">
                <div className="undo-and-end-game-btns-container">
                  <button onClick={this.handleUndo} type="button" className="btn word-submit-button undo" disabled={undoDisabled}>UNDO</button>
                </div>
              </div>
            </div>
          )
        }
        <h3>How to use Scrabble Score Online:</h3>
        <ul>
          <li>Unplayed Letters: When the game ends, each player's score is reduced by the sum of his or her unplayed letters.
              In addition, if a player has used all of his or her letters, the sum of the other players' unplayed letters is added to that player's score.</li>
          <li>Click SUBMIT NO LEFTOVERS if you finished your game without any tiles on your rack.</li>
          <li>Click SUBMIT LEFTOVERS to submit tiles that are left on your rack when you finished the game.</li>
          <li>If you made a mistake, use unlimited UNDO.</li>
        </ul>
      </div>
    );
  }
}

export default InGameOverControls;
