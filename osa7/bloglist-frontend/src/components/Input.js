import React from 'react'

const Input = ({ label, ...props }) => (
  <div>
    {label}
    <input {...props} />
  </div>
)

const TextInput = (props) => Input({ ...props, type: 'text' })

const PasswordInput = props => Input({ ...props, type: 'password' })

export { TextInput, PasswordInput }

export default Input
