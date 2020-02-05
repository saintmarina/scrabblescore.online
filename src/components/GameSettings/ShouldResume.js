import React from 'react';
import './GameSettings.css';
import HomePage from './HomePage';


class ShouldResume extends React.Component {
  render() {
    const { onResume } = this.props;

    return (
      <HomePage>
        <div className="row justify-content-around">
          <div className="col-sm-6">
            <div className="should-resume">
              <p>
                You have a game in progress. <br />Would you like to resume it?
              </p>
              <div className="buttons">
                <div className="row">
                  <div className="col">
                    <button className="btn faded" type="button" onClick={() => onResume(false)}>No</button>
                  </div>
                  <div className="col">
                    <button className="btn" type="button" onClick={() => onResume(true)}>Yes</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </HomePage>
    );
  }
}

export default ShouldResume;
