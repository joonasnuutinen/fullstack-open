import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initUsers } from '../reducers/userReducer'

const UserRow = ({ user }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

const Users = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initUsers())
  }, [dispatch])

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
