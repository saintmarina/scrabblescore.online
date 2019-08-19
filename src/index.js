import React from 'react';
import { hydrate, render } from "react-dom";
import './index.css';
import ScrabbleScoreKeeper from './components/ScrabbleScoreKeeper/ScrabbleScoreKeeper';
import * as serviceWorker from './serviceWorker';
import amplitude from 'amplitude-js';

amplitude.getInstance().init('908142045794995ec39e6025a04bfdb4');

const rootElement = document.getElementsByClassName('content')[0];
if (rootElement.hasChildNodes()) {
  hydrate(<ScrabbleScoreKeeper/>, rootElement);
} else {
  render(<ScrabbleScoreKeeper/>, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();