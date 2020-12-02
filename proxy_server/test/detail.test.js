import { readFileSync } from 'fs'
import { resolveData } from '../api/detail'
import { parse } from 'node-html-parser'
import { request } from '../request'

async function main() {
  let html = await request({
    params: {
      id: 3037756,
      page: 'post',
      s: 'view',
    },
  })
  const root = parse(html)
  let els = root.querySelectorAll('.tag-type-copyright a')
  console.log(els.map((el) => el.text))
}

main()
