import { readFileSync } from 'fs'
import { resolveData } from '../api/list'

let html = readFileSync(`${__dirname}\\list.html`, 'utf-8')

console.log(JSON.stringify(resolveData(html)))
