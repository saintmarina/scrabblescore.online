
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ScrabbleScoreKeeper from './components/ScrabbleScoreKeeper/ScrabbleScoreKeeper';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ScrabbleScoreKeeper/>, document.getElementsByClassName('content')[0]);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
