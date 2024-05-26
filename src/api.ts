import axios from 'axios'
import { Amplify } from 'aws-amplify'
import { fetchAuthSession } from 'aws-amplify/auth'
import * as https from 'node:https'

const api = axios.create({
  baseURL: 'http://localhost:8080' // replace with your API base URL
})

api.interceptors.request.use(
  async (config) => {
    try {
      let token: string | undefined = undefined
      await fetchAuthSession()
        .then((data) => {
          token = data.tokens?.accessToken?.toString()
        })
        .catch((err) => {
          console.log(err)
        })
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Failed to get access token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
