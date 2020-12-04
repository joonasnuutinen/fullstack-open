const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.content
    default:
      return state
  }
}

export const showNotification = (content) => {
  return {
    type: 'SET_NOTIFICATION',
    content
  }
}

export const removeNotification = () => {
  return {
    type: 'SET_NOTIFICATION',
    content: ''
  }
}

export default reducer
