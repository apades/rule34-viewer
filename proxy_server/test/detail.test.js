import { readFileSync } from 'fs'
import { resolveData } from '../api/detail'

let html = readFileSync(`${__dirname}\\detail.html`, 'utf-8')

console.log(resolveData(html))
