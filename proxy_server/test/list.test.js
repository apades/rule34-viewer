import { readFileSync } from 'fs'
import { resolveData } from '../api/list'
import { request } from '../request'

async function main() {
  let html = await request({
    params: {
      page: 'post',
      s: 'list',
      tags: 'dacad',
    },
  })

  console.log(JSON.stringify(resolveData(html)))
}

main()
