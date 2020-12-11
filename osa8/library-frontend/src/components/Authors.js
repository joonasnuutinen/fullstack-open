import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'
import Loading from './Loading'

const BirthyearForm = ({ authorNames }) => {
  const [born, setBorn] = useState('')
  const [selectedName, setSelectedName] = useState(null)

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    updateAuthor({ variables: { name: selectedName?.value, setBornTo: Number(born) } })

    setSelectedName(null)
    setBorn('')
  }

  const nameOptions = authorNames.map(a => { return { value: a, label: a } })

  return (
    <form onSubmit={handleSubmit}>
      <Select
        value={selectedName}
        onChange={setSelectedName}
        options={nameOptions}
      />
      <div>
        born
        <input type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
      </div>
      <button type="submit">update author</button>
    </form>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <Loading />
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <BirthyearForm authorNames={authors.map(a => a.name)} />
    </div>
  )
}

export default Authors
