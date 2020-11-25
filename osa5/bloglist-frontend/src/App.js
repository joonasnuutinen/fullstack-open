import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Input = ({ label, type, value, name, setValue }) => (
  <div>
    {label}
    <input
      type={type}
      value={value}
      name={name}
      onChange={({ target }) => setValue(target.value)}
    />
  </div>
)

const TextInput = (props) => Input({ ...props, type: 'text' })

const PasswordInput = props => Input({ ...props, type: 'password' })

const LoginForm = ({ username, setUsername, password, setPassword, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <TextInput label="username" value={username} name="username" setValue={setUsername} />
    <PasswordInput label="password" value={password} name="password" setValue={setPassword} />
    <button type="submit">login</button>
  </form>
)

const NewBlogForm = ({ afterSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    const newBlog = { title, author, url }
    const storedBlog = await blogService.create(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
    afterSubmit(storedBlog)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput label="title" value={title} name="title" setValue={setTitle} />
      <TextInput label="author" value={author} name="author" setValue={setAuthor} />
      <TextInput label="url" value={url} name="url" setValue={setUrl} />
      <button type="submit">create</button>
    </form>
  )
}

const BlogList = ({ blogs }) => (
  <div>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
)

const ErrorMessage = ({ msg }) => msg && <div>{msg}</div>

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  

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
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(userStorageKey)
    setUser(null)
  }

  const addToBlogs = storedBlog => {
    setBlogs(blogs.concat(storedBlog))
  }

  return (
    <div>
      <ErrorMessage msg={errorMessage} />
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
          <NewBlogForm afterSubmit={addToBlogs} />
          <BlogList blogs={blogs} />
        </>
      }
    </div>
  )
}

export default App