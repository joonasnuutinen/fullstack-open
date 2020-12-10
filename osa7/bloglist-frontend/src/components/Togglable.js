import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button } from './Input'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      {visible ?
        <>
          {props.children}
          <Button onClick={toggleVisibility}>cancel</Button>
        </> :
        <>
          <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
        </>
      }
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
