import React, { useState } from 'react'
import './App.css'

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = () => good + neutral + bad
  const average = () => {
    const votes = all()
    if (votes <= 0) {
      return 0
    }

    return (good - bad) / votes
  }
  const percentGood = () => {
    const votes = all()
    if (votes <= 0) {
      return 0
    }

    return (good / votes) * 100.0
  }

  return (
    <>
      <h1>give feedback</h1>

      <button onClick={() => setGood(good+1)}>good</button>
      <button onClick={() => setNeutral(neutral+1)}>neutral</button>
      <button onClick={() => setBad(bad+1)}>bad</button>

      <h1>statistics</h1>

      <p>
        good {good} <br/>
        neutral {neutral} <br/>
        bad {bad} <br/>
        all {all()} <br/>
        average {average()} <br/>
        positive {percentGood()} %<br/>
      </p>
    </>
  )
}

export default App
