import Cookies from 'js-cookie'

const token_key = 'acon_credentials_key'

export function getToken () {
  return Cookies.get(token_key)
}

export function setToken (credentials) {
  return Cookies.set(token_key, credentials)
}

export function removeToken () {
  return Cookies.remove(token_key)
}
