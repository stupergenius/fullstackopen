import React from 'react'

export default ({parts}) => {
  const totalExercises = parts.reduce((acc, p) => acc + p.exercises, 0)

  return (
    <p><b>total of {totalExercises} exercises</b></p>
  )
}