import React from 'react';
import PropTypes from 'prop-types';

function CurrentScore(props) {
  const { score } = props;
  return (
    <div className="card-header current_score">
      {`Score is ${score}`}
    </div>
  );
}

CurrentScore.propTypes = {
  score: PropTypes.number,
};

export default CurrentScore;
