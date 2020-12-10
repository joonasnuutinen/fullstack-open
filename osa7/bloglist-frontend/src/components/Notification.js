import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const NotificationContainer = styled.div`
  padding: 10px;
  border-style: solid;
  background: white;
  color: ${props => props.color};
`

const Notification = () => {
  const message = useSelector((state => state.notification))
  if (!message) return null

  const colors = { success: 'green', error: 'red', default: 'blue' }
  const type = message.type || 'default'

  return (
    <NotificationContainer color={colors[type]}>
      {message.content}
    </NotificationContainer>
  )
}

export default Notification
