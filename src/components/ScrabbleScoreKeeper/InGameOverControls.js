import React from 'react';
import { scrabbleScore, logEvent } from '../../logic/util';
import ScrabbleInputBox from '../ScrabbleInputBox/ScrabbleInputBox';

const emptyWord = { value: '', modifiers: [], score: 0 };

class InGameOverControls extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleLeftOvers = this.handleLeftOvers.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
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

    logEvent('undo');
  }

  handleChange(word) {
    const { language } = this.props;
    const currentWord = { ...word, score: -scrabbleScore(word.value, word.modifiers, language) };
    this.setState({ currentWord });
  }

  handleNewGame() {
    const { onNewGame } = this.props;
    onNewGame({reset: true});
    logEvent('new-game')
  }

  handleLeftOvers(e) {
    const { currentWord } = this.state;
    const { onSetGame } = this.props;
    let { game } = this.props;

    e.preventDefault(); /* prevent form submission */

    if (currentWord.value.length !== 0)
      game = game.addWord(currentWord);

    game = game.endTurn();

    if (game.currentPlayerIndex === 0)
      game = game.distributeLeftOversToReapers(game.getReapers(), game.getSumOfLeftovers());

    onSetGame(game);
    this.resetCurrentWord();

    const data = currentWord.value.length !== 0
                    ? {'leftovers': currentWord.value}
                    : {'leftovers': 'No leftovers submitted'};
    logEvent('submit-leftovers', data);
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
                <div className="row">
                  <div className="col">
                    <button onClick={this.handleLeftOvers} type="submit" className="btn">{submitButtonText}</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button onClick={this.handleUndo} type="button" className="btn" disabled={undoDisabled}>UNDO</button>
                  </div>
                </div>
              </div>
            </form>
          )
          : (
            <div className="buttons">            
              <div className="row">
                <div className="col">
                  <button onClick={this.handleNewGame} type="button" className="btn">NEW GAME</button>
                </div>
              </div>
              <div className="rate-me">
                <div className="row apple">
                  <div className="col">
                    <a className="btn app-store-rating" href="https://apps.apple.com/us/app/scrabble-score-calculator/id1497216063" rel="noopener noreferrer" target="_blank">
                      <span role="img" aria-label="Star">⭐</span> RATE US ON THE APP STORE <span role="img" aria-label="Star">⭐</span>
                    </a>
                  </div>
                </div>
                <div className="row playmarket">
                  <div className="col">
                    <a className="btn android-rating" href="https://play.google.com/store/apps/details?id=com.saintmarina.scrabblescore" rel="noopener noreferrer" target="_blank">
                      <span role="img" aria-label="Star">⭐</span> RATE US ON PLAY STORE <span role="img" aria-label="Star">⭐</span>
                    </a>
                  </div>
                </div>
               </div>
              <div className="row">
                <div className="col">
                  <button onClick={this.handleUndo} type="button" className="btn" disabled={undoDisabled}>UNDO</button>
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
