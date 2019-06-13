import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Board} from './app.js'

ReactDOM.render(
  <Board
    server={"http://localhost:5000"}
    initDifficulty={"hard"}
    initSize={4} />,
  document.getElementById('app-root')
)
