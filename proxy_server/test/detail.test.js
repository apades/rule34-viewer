import { readFileSync } from 'fs'
import { resolveData } from '../api/detail'
import { parse } from 'node-html-parser'

let html = readFileSync(`${__dirname}\\detail.html`, 'utf-8')

// console.log(resolveData(html))

const root = parse(html)
let els = root.querySelectorAll('.tag-type-copyright a')
console.log(els.map((el) => el.text))
