import React from 'react'

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

export { TextInput, PasswordInput }

export default Input
