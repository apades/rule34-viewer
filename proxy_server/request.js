import axios from 'axios'
import HttpsProxyAgent from 'https-proxy-agent'

let request = axios.create({
  httpsAgent: new HttpsProxyAgent('http://localhost:10809'),
  headers: {
    'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36`,
  },
})

request.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('axios error'.red)
  },
)

export { request }
