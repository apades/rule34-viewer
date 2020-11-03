import Axios from 'axios'
import { _env } from './env'

let request = Axios.create({
  // baseURL: _env.baseURL,
  timeout: 5000,
})

request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    console.error('axios error', error)
  }
)

request.interceptors.request.use(
  (req) => {
    return req
  },
  (err) => {
    console.error('axios请求错误', error)
  }
)

export default request
