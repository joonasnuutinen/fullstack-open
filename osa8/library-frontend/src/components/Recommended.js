import React from 'react'
import { useQuery } from '@apollo/client'
import { ME_BOOKS } from '../queries'
import Loading from './Loading'
import { BookTable } from './Books'

const Recommended = ({ show }) => {
  const result = useQuery(ME_BOOKS)
  if (!show) return null

  if (result.loading) {
    return <Loading />
  }

  const user = result.data.me
  const books = result.data.allBooks
  
  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre {user.favoriteGenre}
      </div>
      <BookTable books={books} genre={user.favoriteGenre} />
    </div>
  )
}

export default Recommended
