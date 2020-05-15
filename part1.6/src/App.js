import React, { useState } from 'react'
import './App.css'

const Statistic = ({ name, value }) => {
  return (
    <span>{name} {value}</span>
  )
}

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

  if (!hasFeedback) {
    return <p>No feedback given</p>
  }

  return (
    <p>
      <Statistic name="good" value={good} /> <br />
      <Statistic name="neutral" value={neutral} /> <br />
      <Statistic name="bad" value={bad} /> <br />
      <Statistic name="all" value={all} /> <br />
      <Statistic name="average" value={average} /> <br />
      <Statistic name="positive" value={`${percentGood} %`} /> <br />
    </p>
  )
}

const Button = ({ name, onClick }) => {
  return (
    <button onClick={onClick}>{name}</button>
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

      <Button onClick={() => setGood(good + 1)} name="good" />
      <Button onClick={() => setNeutral(neutral + 1)} name="neutral" />
      <Button onClick={() => setBad(bad + 1)} name="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App
