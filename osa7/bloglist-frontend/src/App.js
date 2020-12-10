import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import BlogList from './components/BlogList'
import Login from './components/Login'
import Users from './components/Users'
import { stayLoggedIn, logout } from './reducers/userReducer'

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

const LoggedInStatusBar = ({ user, handleLogout }) => (
  <p>
    {user.name} logged in
    <button onClick={handleLogout}>logout</button>
  </p>
)

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.users.current)

  useEffect(() => {
    dispatch(stayLoggedIn())
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Router>
      <Notification />
      {user === null
        ?
        <Login />
        :
        <div>
          <h2>blogs</h2>
          <LoggedInStatusBar user={user} handleLogout={handleLogout} />

          <Switch>
            <Route path='/users'>
              <Users />
            </Route>
            <Route path='/'>
              <BlogList user={user} />
            </Route>
          </Switch>
        </div>
      }
    </Router>
  )
}

export default App