import React, { useState, useEffect } from 'react'
import personsService from './services/persons'
import './App.css'

const Notification = ({ type, message }) => {
  if (message === null) {
    return null
  }

  const styles = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return (
    <div style={styles}>
      {message}
    </div>
  )
}

const Persons = ({ persons, onDeletePerson }) => persons.map(p => (
  <Person
    key={p.name}
    person={p}
    onDeletePerson={onDeletePerson}
  />
))

const Person = ({ person, onDeletePerson }) => {
  const handleDelete = () => onDeletePerson(person)

  return (
    <div>
      <span>{person.name} {person.number}</span>
      &nbsp;<button type="button" onClick={handleDelete}>delete</button>
      <br />
    </div>
  )
}

const Filter = ({ onChange }) => (
  <div>
    filter shown with:&nbsp;
    <input onChange={onChange} />
  </div>
)

const PersonForm = ({ newName, newNumber, handlers }) => (
  <form>
    <div>
      name: <input value={newName} onChange={handlers.handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handlers.handleNumberChange} />
    </div>
    <div>
      <button type="submit" onClick={handlers.handleFormSubmit}>add</button>
    </div>
  </form>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService.getAll().then(data => setPersons(data))
  }, [])

  const personsToShow = searchQuery.length > 0
    ? persons.filter(p => p.name.toLocaleLowerCase().includes(searchQuery))
    : persons

  const showSuccess = (message) => {
    setSuccessMessage(message)

    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const parseResponseError = (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      return error.response.data.error
    }
    return 'Error making request'
  }

  const showError = (message) => {
    setErrorMessage(message)

    setTimeout(() => setErrorMessage(null), 3000)
  }

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

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

  const updateExistingPerson = (existingPerson, newPerson) => {
    personsService.update(existingPerson.id, newPerson)
      .then((data) => {
        setPersons(persons.map(p => (p.id === existingPerson.id ? data : p)))
        showSuccess(`Updated ${existingPerson.name}`)
      })
      .catch(e => showError(parseResponseError(e)))

    clearForm()
  }

  const createNewPerson = (newPerson) => {
    personsService.create(newPerson)
      .then((data) => {
        setPersons(persons.concat(data))
        showSuccess(`Added ${newPerson.name}`)
      })
      .catch(e => showError(parseResponseError(e)))

    clearForm()
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updateExistingPerson(existingPerson, newPerson)
      }
    } else {
      createNewPerson(newPerson)
    }
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.delete(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setSuccessMessage(`Deleted ${person.name}`)
        })
        .catch(() => setErrorMessage(`Error deleting ${person.name}`))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification type="success" message={successMessage} />
      <Notification type="error" message={errorMessage} />

      <Filter onChange={handleSearchQueryChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handlers={{ handleNameChange, handleNumberChange, handleFormSubmit }}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App
