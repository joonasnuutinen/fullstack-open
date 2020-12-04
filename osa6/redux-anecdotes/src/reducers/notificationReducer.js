const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET':
      return action.content
    default:
      return state
  }
}

export const showNotification = (content) => {
  return {
    type: 'SET',
    content
  }
}

export const removeNotification = () => {
  return {
    type: 'SET',
    content: ''
  }
}

export default reducer
