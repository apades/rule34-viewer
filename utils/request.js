import Axios from 'axios'
import { _env, ip } from './env'

let request = Axios.create({
  // baseURL: _env.baseURL,
  baseURL: (_env.proxy_server && `http://${ip}:3001`) || '',
  // timeout: 5000,
})

request.interceptors.response.use(
  (res) => {
    return ['get', 'post', 'delete', 'put'].includes(res.config.method)
      ? res.data
      : res
  },
  (err) => {
    console.error('axios error', err)
  },
)

request.interceptors.request.use(
  (req) => {
    req.headers['user-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
    return req
  },
  (err) => {
    console.error('axios请求错误', err)
  },
)

export default request
