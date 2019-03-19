import React from 'react';

export class Section1 extends React.Component {
  state = {
    numberOfPlayers: this.props.defaultNumberOfPlayers
  }

  handleChange(e) {
    this.setState({numberOfPlayers: parseInt(e.target.value)});
  }

  render() {
    return (
      <div className='section1'>
        <h3>Choose number of players:</h3>
        <div>
          <select value={this.state.numberOfPlayers} onChange={this.handleChange.bind(this)} className="custom-select">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select><br /><br />
          <div className="input-group-append">
              <button onClick={() => this.props.onNext(this)} type="submit" className="btn btn-info">Next</button>
          </div><br /><br />
        </div>
      </div>
    );
  }
}

export class Section2 extends React.Component {
  state = {
    playerNames: this.props.defaultNames,
    numberOfPlayers: this.props.defaultNumberOfPlayers
  }

  get playerNames() {
    return this.state.playerNames;
  }

  handleChange(i, e) {
    let names = this.state.playerNames.slice();
    names[i] = e.target.value;
    this.setState({playerNames: names});
  }

  render() {
    return (
      <div className='section2'>
        <div className="main-text">
          <h3>Choose nicknames for players:</h3>
          <div className="input_names">
            {this.state.playerNames.map((name, i) => 
              <input onChange={e => this.handleChange(i, e)}
                key={i} type="text" className="form-control player-name"
                placeholder={`Player ${i+1}`} value={name} /> )}
          </div><br />
          <div className='input-group'>
              <button onClick={() => this.props.onBack(this)} type="submit" className="btn btn-info">Back</button>
              <button onClick={() => this.props.onNext(this)} type="submit" className="btn btn-info">Next</button>
              <br /><br />
          </div>
        </div>
      </div>
    );
  }
}