import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Link } from 'react-router-dom'
import styled from 'styled-components'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import Login from './components/Login'
import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import { stayLoggedIn, logout, initUsers } from './reducers/userReducer'
import { initBlogs } from './reducers/blogReducer'

const Nav = styled.nav`
  background: #8bcdff;
  color: blue;
  padding: 5px;
  display: flex;
`

const LoggedInStatus = styled.div`
  padding: 3px 6px;
  margin-left: auto;
`

const NavBar = ({ user, handleLogout }) => {
  const linkStyle = {
    padding: '3px 6px',
    color: 'blue',
    textDecoration: 'none',
    fontWeight: 'bold'
  }

  return (
    <Nav>
      <Link style={linkStyle} to='/'>blogs</Link>
      <Link style={linkStyle} to='/users'>users</Link>
      <LoggedInStatus>
        Hi, {user.name.split(' ')[0]}! <a style={linkStyle} href="#" onClick={handleLogout}>logout</a>
      </LoggedInStatus>
    </Nav>
  )
}

const Page = styled.div``

const AppTitle = styled.h2`
  text-align: center;
`

const LoggedInArea = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`

const Main = styled.main`
  padding: 0 10px;
`

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
    <Page>
      {user === null
        ?
        <Login />
        :
        <LoggedInArea>
          <Notification />
          <AppTitle>blog app</AppTitle>
          <NavBar user={user} handleLogout={handleLogout} />

          <Main>
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
          </Main>
        </LoggedInArea>
      }
    </Page>
  )
}

export default App