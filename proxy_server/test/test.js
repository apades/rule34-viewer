import { HttpsProxyAgent } from 'https-proxy-agent'
import { request } from '../request'
import Axios from 'axios'

async function main() {
  try {
    // let data = await getList({ tags: 'dacad' })
    let data = await request.head(
      'https://rule34.xxx//images/3475/a51d55b12e7a16a37253783e52c4ec21.webm',
    )
    console.log(data.headers)
  } catch (error) {
    console.error(error)
  }
}

main()
