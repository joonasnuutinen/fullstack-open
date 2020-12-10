import loginService from '../services/login'
import blogService from '../services/blogs'

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.user
  default:
    return state
  }
}

const userStorageKey = 'loggedBlogAppUser'

const setUser = user => {
  return {
    type: 'SET_USER',
    user
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem(
      userStorageKey, JSON.stringify(user)
    )

    blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export const stayLoggedIn = () => {
  const loggedUserJSON = window.localStorage.getItem(userStorageKey)
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return setUser(user)
  }
  return { type: 'PASS' }
}

export const logout = () => {
  window.localStorage.removeItem(userStorageKey)
  return setUser(null)
}

export default userReducer
