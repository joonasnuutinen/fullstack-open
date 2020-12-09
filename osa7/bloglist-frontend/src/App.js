import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import { TextInput, PasswordInput } from './components/Input'
import blogService from './services/blogs'
import loginService from './services/login'
import { notify } from './reducers/notificationReducer'
import { initBlogs } from './reducers/blogReducer'

const LoginForm = ({ username, setUsername, password, setPassword, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <TextInput label="username" value={username} name="username" setValue={setUsername} />
    <PasswordInput label="password" value={password} name="password" setValue={setPassword} />
    <button type="submit">login</button>
  </form>
)

const BlogList = ({ handleDelete, user }) => {
  const sortedBlogs = useSelector(state => state.blogs.sort((b1, b2) => b2.likes - b1.likes))

  return (
    <div id="blogs">
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleDelete={handleDelete}
          user={user}
        />
      )}
    </div>
  )
}

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

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initBlogs())
  }, [dispatch])

  const userStorageKey = 'loggedBlogAppUser'

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(userStorageKey)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        userStorageKey, JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      msg.error('wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(userStorageKey)
    setUser(null)
  }

  const msg = {
    success: message => dispatch(notify(message, 'success')),
    error: message => dispatch(notify(message, 'error'))
  }

  return (
    <div>
      <Notification />
      {user === null ?
        <>
          <h2>log in to application</h2>
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            onSubmit={handleLogin}
          />
        </> :
        <>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>

          <h2>create new</h2>
          <BlogForm />
          <BlogList
            user={user}
          />
        </>
      }
    </div>
  )
}

export default App