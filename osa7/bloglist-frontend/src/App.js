import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Link } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import Login from './components/Login'
import Users from './components/Users'
import User from './components/User'
import { stayLoggedIn, logout, initUsers } from './reducers/userReducer'
import { initBlogs } from './reducers/blogReducer'

const Notification = () => {
  const message = useSelector((state => state.notification))
  if (!message) return null

  const colors = { success: 'green', error: 'red', default: 'blue' }
  const type = message.type || 'default'
  const style = {
    padding: 10,
    color: colors[type],
    borderStyle: 'solid',
    background: 'lightgray',
  }
  return (
    <div style={style}>
      {message.content}
    </div>
  )
}

const NavBar = ({ user, handleLogout }) => {
  const navStyle = {
    background: 'lightgray',
    padding: 5
  }
  const linkStyle = {
    padding: 3
  }

  return (
    <nav style={navStyle}>
      <Link style={linkStyle} to='/'>blogs</Link>
      <Link style={linkStyle} to='/users'>users</Link>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </nav>
  )
}

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.users.current)

  useEffect(() => {
    dispatch(stayLoggedIn())
    dispatch(initUsers())
    dispatch(initBlogs())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div>
      <Notification />
      {user === null
        ?
        <Login />
        :
        <div>
          <h2>blog app</h2>
          <NavBar user={user} handleLogout={handleLogout} />

          <Switch>
            <Route path='/users/:id'>
              <User />
            </Route>
            <Route path='/users'>
              <Users />
            </Route>
            <Route path='/blogs/:id'>
              <Blog />
            </Route>
            <Route path='/'>
              <BlogList user={user} />
            </Route>
          </Switch>
        </div>
      }
    </div>
  )
}

export default App