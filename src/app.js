import React from 'react'

export class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      won: false,
      model: [],
      difficulty: '',
      size: 0,
      startTime: 0
    }

    this.requestDifficulty = ''
    this.requestSize = 0

    this.initModel = this.initModel.bind(this)
    this.onNewGame = this.onNewGame.bind(this)
    this.onDifficultySelect = this.onDifficultySelect.bind(this)
    this.onSizeSelect = this.onSizeSelect.bind(this)
  }

  initModel(difficulty, size) {
    fetch(`${this.props.server}/new/${difficulty}/${size}`)
        .then(res => res.json())
        .then(json => {
          this.setState({
            model: json,
            size,
            difficulty,
            startTime: new Date().getMilliseconds()
          })
        })
        .catch(err => console.error(`Could not fetch game data from server! Error: ${err}`))
  }

  trySwap(i, j) {
    const data = new FormData()
    data.append('i', i)
    data.append('j', j)

    fetch(`${this.props.server}/swap`, {
      method: 'POST',
      body: data
    })
        .then(res => res.json())
        .then(json => {
          if (json) {
            return this.setState({
              won: json.won,
              model: json.model,
              size: json.model.length
            })
          }
          console.log(`Swap failed! Are you sure it was a legal move?`)
        })
        .catch(err => console.error(`Could not fetch game data from server! Error: ${err}`))
  }

  componentDidMount() {
    this.initModel(
      this.props.initDifficulty,
      this.props.initSize
    )
  }

  onNewGame(e) {
    this.initModel(
      this.requestDifficulty,
      this.requestSize
    )
    e.preventDefault()
  }

  onDifficultySelect(e) {
    if (e.target.value) {
      this.requestDifficulty = e.target.value
    }
    e.preventDefault()
  }

  onSizeSelect(e) {
    if (e.target.value) {
      this.requestSize = parseInt(e.target.value, 10)
    }
    e.preventDefault()
  }

  render() {
    return (
      <div id={"game-board"}>
        <div id={"model-container"}>
        {
          this.state.model
            .map((r, j) => {
              return (
                <div key={j} className="game-board-row">
                {
                  r.map((v, i) => (
                    <Tile
                        key={v} value={v}
                        row={j} col={i}
                        onClick={e => this.trySwap(i, j)} />
                  ))
                }
                </div>
              )
            })
        }
        </div>
        <SettingsToolbar
            size={this.state.size}
            difficulty={this.state.difficulty}
            onNewGame={this.onNewGame}
            onDifficultySelect={this.onDifficultySelect}
            onSizeSelect={this.onSizeSelect} />
        {
          this.state.won &&
          <h1 id="win-banner">You won!</h1>
        }
      </div>
    )
  }
}

export class Tile extends React.Component {
  render() {
    const v = this.props.value
    return (
      <button
          className={"game-tile"}
          id={v? '' : 'tile-hole'}
          onClick={this.props.onClick}>
        {v || '🕳️'}
      </button>
    )
  }
}

class SettingsToolbar extends React.Component {
  render() {
    return (
      <div id={"settings-bar"}>
        <h2>Board Size: {this.props.size}</h2>
        <h2>Difficulty: {this.props.difficulty}</h2>
        <select onChange={e => this.props.onDifficultySelect(e)}>
          <option value=""></option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select onChange={e => this.props.onSizeSelect(e)}>
          <option value=""></option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
        <br />
        <button onClick={e => this.props.onNewGame(e)}>New game</button>
      </div>
    )
  }
}