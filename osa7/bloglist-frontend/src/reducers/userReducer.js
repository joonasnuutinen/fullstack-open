import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/users'

const initState = {
  all: [],
  current: null
}

const userReducer = (state = initState, action) => {
  switch (action.type) {
  case 'SET_CURRENT':
    return {
      ...state,
      current: action.user
    }
  case 'SET_USERS':
    return {
      ...state,
      all: action.users
    }
  default:
    return state
  }
}

const userStorageKey = 'loggedBlogAppUser'

const setCurrent = user => {
  return {
    type: 'SET_CURRENT',
    user
  }
}

export const initUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'SET_USERS',
      users
    })
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem(
      userStorageKey, JSON.stringify(user)
    )

    blogService.setToken(user.token)
    dispatch(setCurrent(user))
  }
}

export const stayLoggedIn = () => {
  const loggedUserJSON = window.localStorage.getItem(userStorageKey)
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return setCurrent(user)
  }
  return { type: 'PASS' }
}

export const logout = () => {
  window.localStorage.removeItem(userStorageKey)
  return setCurrent(null)
}

export default userReducer
