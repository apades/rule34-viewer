import axios from 'axios'
import HttpsProxyAgent from 'https-proxy-agent'
import config from './project.config'

let request = axios.create({
  httpsAgent: config.proxy_Server
    ? new HttpsProxyAgent(config.proxy_Server)
    : undefined,
  headers: config.proxy_DefaultHeaders ?? {},
})

request.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('axios error'.red)
  },
)

export { request }
