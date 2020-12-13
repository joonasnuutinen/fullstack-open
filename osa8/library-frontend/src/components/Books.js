import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import Loading from './Loading'

const BookTable = ({ books, genre }) => {
  const filteredBooks = genre ? books.filter(b => b.genres.includes(genre)) : books

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>
            author
          </th>
          <th>
            published
          </th>
        </tr>
        {filteredBooks.map(a =>
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <Loading />
  }

  const books = result.data.allBooks

  const genres = books.reduce((gs, b) => {
    const newGenres = b.genres.filter(g => !gs.includes(g))
    return gs.concat(newGenres)
  }, [])

  return (
    <div>
      <h2>books</h2>

      {genre &&
        <div>in genre {genre}</div>
      }

      <BookTable books={books} genre={genre} />

      {genres.map(g =>
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
      )}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export { BookTable }

export default Books