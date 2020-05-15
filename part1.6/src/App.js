import React, { useState } from 'react'
import './App.css'

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const hasFeedback = all > 0
  const average = (() => {
    if (!hasFeedback) {
      return 0
    }

    return (good - bad) / all
  })()
  const percentGood = (() => {
    if (!hasFeedback) {
      return 0
    }

    return (good / all) * 100.0
  })()

  return (
    <>
      <h1>statistics</h1>

      {!hasFeedback &&
        <p>No feedback given</p>
      }
      {hasFeedback &&
        <p>
          good {good} <br />
          neutral {neutral} <br />
          bad {bad} <br />
          all {all} <br />
          average {average} <br />
          positive {percentGood} %<br />
        </p>
      }
    </>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>

      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App
