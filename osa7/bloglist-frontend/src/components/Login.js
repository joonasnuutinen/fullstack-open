import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Notification from './Notification'
import { TextInput, PasswordInput, InputContainer, Button } from './Input'
import { notify } from '../reducers/notificationReducer'
import { login } from '../reducers/userReducer'

const Form = styled.form`
  margin: 0 auto;
  background: #8bcdff;
  padding: 50px 10px;
`

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
    <Form onSubmit={handleLogin}>
      <TextInput label="username" name="username" />
      <PasswordInput label="password" name="password" />
      <InputContainer>
        <Button type="submit">login</Button>
      </InputContainer>
      <Notification />
    </Form>
  )
}

const LoginPage = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 3em auto;
`

const Login = () => {
  return (
    <LoginPage>
      <h2>log in to application</h2>
      <LoginForm />
    </LoginPage>
  )
}

export default Login
