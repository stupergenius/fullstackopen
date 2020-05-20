import React, { useState } from 'react'
import './App.css'

const Person = ({person}) => {
  return (
    <>
      <span>{person.name} {person.phone}</span>
      <br />
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-1234567' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = ({ target }) => {
    setNewName(target.value)
  }

  const handleNumberChange = ({ target }) => {
    setNewNumber(target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    const existingNames = persons.map(p => p.name)
    if (existingNames.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { name: newName, phone: newNumber }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={handleFormSubmit}>add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons.map(p =>
        <Person key={p.name} person={p} />
      )}
    </div>
  )
}

export default App
