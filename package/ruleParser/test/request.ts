import Axios from 'axios'

let request = Axios.create({
  // baseURL: _env.baseURL,
  baseURL: `http://localhost:3001`,
  timeout: 5000,
})

request.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('axios error', err)
    throw err
  },
)

request.interceptors.request.use(
  (req) => {
    req.url = `/proxy?url=${encodeURIComponent(req.url)}`
    req.headers['user-agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
    return req
  },
  (err) => {
    console.error('axios请求错误', err)
    throw err
  },
)

export default request
