import axios from 'axios'
import HttpsProxyAgent from 'https-proxy-agent'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { parserXml } from './utils'

let request = axios.create({
  baseURL: 'https://rule34.xxx/index.php?page=dapi&s=post&q=index',
  httpsAgent: new HttpsProxyAgent('http://localhost:10809'),
})

request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    console.error('axios error')
    writeFileSync(resolve(__dirname, './log/axios.log'), err, 'utf8')
  },
)

export async function getList(option = {}) {
  let dataList
  try {
    let data = await request({
      params: {
        ...option,
      },
    })
    let root = parserXml(data).elements[0]
    dataList = {
      count: root.attributes.count,
      offset: root.attributes.offset,
      dataList: root.elements.map((el) => el.attributes),
    }
  } catch (error) {
    dataList = {
      count: 0,
      offset: 0,
      dataList: [],
    }
  }

  return dataList
}

export async function proxy(url, option = {}) {
  return request(url, option)
}
