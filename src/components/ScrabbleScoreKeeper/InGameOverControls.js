import React from 'react';
import CurrentScore from './CurrentScore';
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
    this.input.current.focus();
  }

  resetCurrentWord() {
    this.setState({ currentWord: emptyWord });
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
    const { game, language, undoDisabled, isMobile } = this.props;
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
              {isMobile
                ? null
                : <CurrentScore score={currentWord.score} />
              }
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
      </div>
    );
  }
}

export default InGameOverControls;
