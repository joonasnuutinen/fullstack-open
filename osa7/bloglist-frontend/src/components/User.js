import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const users = useSelector(state => state.users.all)
  const id = useParams().id
  const user = users.find(u => u.id === id)

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(b => <li key={b.id}>{b.title}</li>)}
      </ul>
    </div>
  )
}

export default User
