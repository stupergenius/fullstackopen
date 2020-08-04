import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../queries'

const SetBirthyear = ({ onError }) => {
  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    onError: e => onError(`Error updating author: ${e.message}`)
  })
  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      onError('author not found')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data])

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = event.target.name.value
    const year = event.target.year.value
    if (name === null || name.length === 0
      || year === null || year.length === 0) return
    const born = parseInt(year, 10)

    editAuthor({ variables: { name, born }})

    event.target.name.value = ''
    event.target.year.value = ''
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <span>name <input name="name" /></span> <br/>
        <span>born <input type="number" name="year" /></span> <br/>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthyear
