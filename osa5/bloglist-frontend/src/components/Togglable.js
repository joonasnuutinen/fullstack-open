import React, { useState, useImperativeHandle } from 'react'

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
          <button onClick={toggleVisibility}>cancel</button>
        </> :
        <>
          <button onClick={toggleVisibility}>{props.buttonLabel}</button>
        </>
      }
    </div>
  )
})

export default Togglable
