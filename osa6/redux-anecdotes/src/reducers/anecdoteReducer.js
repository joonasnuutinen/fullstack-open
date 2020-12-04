const getId = () => (100000 * Math.random()).toFixed(0)

const reducer = (state = [], action) => {
  //console.log('state now: ', state)
  //console.log('action', action)

  switch (action.type) {
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data
    case 'VOTE':
      return state.map(
        a => a.id === action.data.id ? { ...a, votes: a.votes + 1 } : a
      )
    default: return state
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    data: {
      content,
      id: getId(),
      votes: 0
    }
  }
}

export const initializeAnecdotes = (data) => {
  return {
    type: 'INIT_ANECDOTES',
    data
  }
}

export const addVote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export default reducer