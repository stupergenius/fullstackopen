import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className="container">
        <App />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root'),
)
