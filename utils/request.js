import Axios from 'axios'
import emojiRegex from 'emoji-regex/text'
import { _env, ip } from './env'

let request = Axios.create({
  // baseURL: _env.baseURL,
  baseURL: (_env.proxy_server && `http://${ip}:3001`) || '',
  // timeout: 5000,
})

request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    console.error('axios error', err)
  },
)

request.interceptors.request.use(
  (req) => {
    return req
  },
  (err) => {
    console.error('axios请求错误', err)
  },
)

export default request
