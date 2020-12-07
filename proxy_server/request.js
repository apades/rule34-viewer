import axios from 'axios'
import HttpsProxyAgent from 'https-proxy-agent'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { parserXml } from './utils'

let request = axios.create({
  baseURL: 'https://rule34.xxx/index.php',
  httpsAgent: new HttpsProxyAgent('http://localhost:10809'),
  headers: {
    'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36`,
  },
})

request.interceptors.response.use(
  (res) => {
    return ['get', 'post', 'delete'].includes(res.config.method)
      ? res.data
      : res
  },
  (err) => {
    console.error('axios error'.red)
    writeFileSync(resolve(__dirname, './log/axios.log'), err, 'utf8')
  },
)

let request_o = axios.create({
  httpsAgent: new HttpsProxyAgent('http://localhost:10809'),
  headers: {
    'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36`,
  },
})

request_o.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    console.error('axios error'.red)
    writeFileSync(resolve(__dirname, './log/axios_o.log'), err, {
      encoding: 'utf-8',
      flag: 'w+',
    })
  },
)

export { request, request_o }
