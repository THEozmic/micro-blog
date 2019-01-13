import auth0js from 'auth0-js'

export const isBrowser = typeof window !== 'undefined'

let profile = false

const auth0 = isBrowser ? new auth0js.WebAuth({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENTID,
  responseType: 'token id_token',
  scope: 'openid profile',
  redirectUri: process.env.REDIRECT_URI,
}) : {}

export const getAccessToken = () => {
  return window.localStorage.getItem('access_token')
}

const getUser = () => {
  return new Promise((resolve, reject) => {
    // If the user has already logged in, don’t bother fetching again.
    if (profile) {
      resolve(profile)
      return
    }

    const accessToken = getAccessToken()

    if (!isLoggedIn()) {
      resolve("no user name")
      return
    }

    auth0.client.userInfo(accessToken, (err, userProfile) => {
      if (err) {
        reject(err)
        return;
      }

      profile = userProfile
      resolve(profile)
    })
  })
}

export const getUserNickname = () => isBrowser ? window.localStorage.getItem("nickname") : ''

export const getUserProfileImage = () => isBrowser ? window.localStorage.getItem("profile_image") : ''

const setUserDetails = user => {
  if (!isBrowser) return false
  window.localStorage.setItem("nickname", `@${user.nickname}`)
  window.localStorage.setItem("profile_image", `${user.picture}`)
}

const setSession = authResult => {
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  )

  window.localStorage.setItem('access_token', authResult.accessToken)
  window.localStorage.setItem('id_token', authResult.idToken)
  window.localStorage.setItem('expires_at', expiresAt)

  return true
}

export const handleLogin = () => {
  auth0.authorize()

  return false
}

export const handleAuthentication = callback => {
  if (!isBrowser) return null
  auth0.parseHash(async (err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult)
      setUserDetails(await getUser())
      callback()
    } else if (err) {
      console.error(err)
    }
  })
}

export const isLoggedIn = () => {
  if (!isBrowser) return null
  let expiresAt = JSON.parse(window.localStorage.getItem('expires_at'))
  return new Date().getTime() < expiresAt
}

export const logout = callback => {
  if (!isBrowser) return null
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('id_token')
  window.localStorage.removeItem('expires_at')
  window.localStorage.removeItem('nickname')
  window.localStorage.removeItem('profile_image')
  callback()
}
