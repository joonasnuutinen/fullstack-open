import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import { TextInput, PasswordInput } from './components/Input'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = ({ username, setUsername, password, setPassword, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <TextInput label="username" value={username} name="username" setValue={setUsername} />
    <PasswordInput label="password" value={password} name="password" setValue={setPassword} />
    <button type="submit">login</button>
  </form>
)

const BlogList = ({ blogs, handleLike }) => (
  <div>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} handleLike={handleLike} />
    )}
  </div>
)

const ErrorMessage = ({ message }) => {
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
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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

  const handleLike = async ({ title, author, url, likes, user, id }) => {
    const updatedBlog = await blogService.update(id, {
      title, author, url, likes: likes + 1, user: user?.id
    })
    setBlogs(blogs.map(
      // Update only likes to keep user data populated
      b => b.id === updatedBlog.id ? { ...b, likes: updatedBlog.likes } : b
    ))
  }

  const addToBlogs = storedBlog => {
    setBlogs(blogs.concat(storedBlog))
    msg.success(`a new blog ${storedBlog.title} by ${storedBlog.author} added`)
  }

  const onAddBlogError = exception => {
    msg.error('Adding new blog failed')
  }

  const showMessage = (content, type) => {
    setMessage({ content, type })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const msg = {
    success: message => showMessage(message, 'success'),
    error: message => showMessage(message, 'error')
  }

  return (
    <div>
      <ErrorMessage message={message} />
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
          <BlogForm onSuccess={addToBlogs} onError={onAddBlogError} />
          <BlogList blogs={blogs} handleLike={handleLike} />
        </>
      }
    </div>
  )
}

export default App