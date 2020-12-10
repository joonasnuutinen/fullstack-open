import React from 'react'
import { useSelector } from 'react-redux'

const UserRow = ({ user }) => {
  return (
    <tr>
      <td><a href={`/users/${user.id}`}>{user.name}</a></td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

const Users = () => {
  const users = useSelector(state => state.users.all)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map(u => <UserRow key={u.id} user={u} />)}
        </tbody>
      </table>
    </div>
  )
}

export default Users
