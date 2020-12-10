import React from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  border-radius: 5px;
  border: 1px solid #aaa;
  padding: 5px;
  display: block;
  width: 100%;
`

export const InputContainer = styled.div`
  margin: 1em auto;
  width: 80%;
`

const Input = ({ label, ...props }) => (
  <InputContainer>
    {label}
    <StyledInput {...props} />
  </InputContainer>
)

export const Button = styled.button`
  background: blue;
  color: white;
  font-weight: bold;
  border: none;
  padding: 1em 2em;
  border-radius: 10px;
  margin: 2px 0;
  cursor: pointer;
`

export const TextInput = (props) => Input({ ...props, type: 'text' })

export const PasswordInput = props => Input({ ...props, type: 'password' })

export default Input
