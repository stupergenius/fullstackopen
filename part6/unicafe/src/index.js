import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const handleAction = (action) => () => {
    store.dispatch({
      type: action
    })
  }

  return (
    <div>
      <button onClick={handleAction('GOOD')}>good</button>
      <button onClick={handleAction('OK')}>neutral</button>
      <button onClick={handleAction('BAD')}>bad</button>
      <button onClick={handleAction('ZERO')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>neutral {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
