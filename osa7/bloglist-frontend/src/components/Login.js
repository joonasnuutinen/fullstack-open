import React from 'react'
import { useDispatch } from 'react-redux'
import { TextInput, PasswordInput } from './Input'
import { notify } from '../reducers/notificationReducer'
import { login } from '../reducers/userReducer'

const LoginForm = () => {
  const dispatch = useDispatch()

  const handleLogin = async event => {
    event.preventDefault()

    try {
      await dispatch(login(event.target.username.value, event.target.password.value))
    } catch (exception) {
      dispatch(notify('wrong credentials', 'error'))
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <TextInput label="username" name="username" />
      <PasswordInput label="password" name="password" />
      <button type="submit">login</button>
    </form>
  )
}

const Login = () => {
  return (
    <div>
      <h2>log in to application</h2>
      <LoginForm />
    </div>
  )
}

export default Login
