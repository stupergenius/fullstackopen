import React, { useState, useEffect } from 'react'
import personsService from './services/persons'
import './App.css'

const Persons = ({ persons }) => persons.map(p =>
  <Person key={p.name} person={p} />
)

const Person = ({ person }) => {
  return (
    <>
      <span>{person.name} {person.phone}</span>
      <br />
    </>
  )
}

const Filter = ({ onChange }) => {
  return (
    <div>
      filter shown with:&nbsp;
      <input onChange={onChange} />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, onNameChange, onNumberChange, onSubmit }) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={onSubmit}>add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    personsService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  const personsToShow = searchQuery.length > 0
    ? persons.filter(p => p.name.toLocaleLowerCase().includes(searchQuery))
    : persons

  const handleNameChange = ({ target }) => setNewName(target.value)

  const handleNumberChange = ({ target }) => setNewNumber(target.value)

  const handleSearchQueryChange = ({ target }) => {
    const query = target.value
    if (query == null) {
      setSearchQuery('')
    } else {
      setSearchQuery(query.trim().toLocaleLowerCase())
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    const existingNames = persons.map(p => p.name)
    if (existingNames.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { name: newName, phone: newNumber }
    personsService.create(newPerson).then(data => {
      setPersons(persons.concat(data))
    })

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onChange={handleSearchQueryChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName} newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleFormSubmit} />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
