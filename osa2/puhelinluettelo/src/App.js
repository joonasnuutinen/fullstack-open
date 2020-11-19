import React, { useEffect, useState } from 'react'
import personService from './services/persons'

const Input = ({ label, value, onChange }) => (
  <div>
    {label}:
    <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = (props) => {
  const {
    onSubmit,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange
  } = props
  
  return (
    <form onSubmit={onSubmit}>
      <Input label="name" value={newName} onChange={handleNameChange} />
      <Input label="number" value={newNumber} onChange={handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonsList = ({ persons, filter, removePerson }) => (
  <div>
    {persons
      .filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))
      .map(person => <Person key={person.id} person={person} removePerson={removePerson} />)}
  </div>
)

const Person = ({ person, removePerson }) => (
  <div>
    {person.name} {person.number} <button onClick={() => removePerson(person.id)}>delete</button>
  </div>
)

const Message = ({ msg }) => {
  if (msg === null) {
    return null
  }

  const messageStyle = {
    color: 'green',
    padding: 10,
    background: 'lightgray',
    borderStyle: 'solid',
    borderRadius: 5,
    marginBottom: 10
  }

  return (
    <div style={messageStyle}>
      {msg}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).indexOf(newName) !== -1) {
      if (!window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        return
      }
      // Update existing
      const existingPerson = persons.find(person => person.name === newName)
      const updatedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p))
          setNewName('')
          setNewNumber('')
          showMessage(`Updated ${newName}`)
        })
      return
    }

    // Add new
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${newName}`)
      })
  }

  const removePerson = (id) => {
    const name = persons.find(person => person.id === id).name
    if (!window.confirm(`Delete ${name}?`)) {
      return
    }
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        showMessage(`Deleted ${name}`)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }
  
  return (
    <div>
      <h1>Phonebook</h1>
      <Message msg={message} />
      <Input label="filter" value={newFilter} onChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>
      <PersonsList persons={persons} filter={newFilter} removePerson={removePerson} />
    </div>
  );
}

export default App
