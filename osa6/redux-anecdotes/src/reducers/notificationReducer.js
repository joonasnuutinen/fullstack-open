const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.content
    default:
      return state
  }
}

const showNotification = (content) => {
  return {
    type: 'SET_NOTIFICATION',
    content
  }
}

const removeNotification = () => {
  return {
    type: 'SET_NOTIFICATION',
    content: ''
  }
}

let notificationID = null

export const setNotification = (content, duration = 5) => {
  return async dispatch => {
    dispatch(showNotification(content))
    await new Promise(r => {
      if (notificationID) {
        clearTimeout(notificationID)
      }
      notificationID = setTimeout(r, duration * 1000)
    })
    dispatch(removeNotification())
    notificationID = null
  }
}

export default reducer
