export const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem('token')
}

export const getPayload = () => {
  const token = getTokenFromLocalStorage()
  if (!token) return
  const splitToken = token.split('.')
  if (splitToken.length < 3) return
  const payloadString = splitToken[1]
  return JSON.parse(atob(payloadString))
}

export const userIsAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return false
  const now = Math.round(Date.now() / 1000)
  return now < payload.exp
}

export  const userIsOwner = (currentUserId) => {
  const payload = getPayload() 
  if (!payload) return false 
  return currentUserId === payload.sub
}