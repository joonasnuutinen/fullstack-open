const notificationReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.message
  default:
    return state
  }
}

const setNotification = (message) => {
  return {
    type: 'SET_NOTIFICATION',
    message
  }
}

let notificationTimeoutID = null

export const notify = (content, type = 'default') => {
  return dispatch => {
    dispatch(setNotification({ content, type }))
    if (notificationTimeoutID) {
      clearTimeout(notificationTimeoutID)
    }
    notificationTimeoutID = setTimeout(() => {
      dispatch(setNotification(null))
      notificationTimeoutID = null
    }, 5000)
  }
}

export default notificationReducer
