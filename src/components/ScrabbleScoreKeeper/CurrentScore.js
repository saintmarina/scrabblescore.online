import React from 'react';
import PropTypes from 'prop-types';

function CurrentScore(props) {
  const { score } = props;
  return (
    <div className="current-score">
      {score}
    </div>
  );
}

CurrentScore.propTypes = {
  score: PropTypes.number,
};

export default CurrentScore;
