import { readFileSync } from 'fs'
import { resolveData } from '../api/detail'
import { parse } from 'node-html-parser'

let html = readFileSync(`${__dirname}\\detail.html`, 'utf-8')

// console.log(resolveData(html))

let test = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  
  <body>
  <ul class="flat-list" id="subnavbar" style="margin-bottom: 1px;">
  <li><a href="index.php?page=post&amp;s=list">List</a></li>
  <li><a href="index.php?page=post&amp;s=add">Upload</a></li>
  <li><a href="index.php?page=post&amp;s=addVideo">Upload WebM</a></li>
  <li><a href="index.php?page=post&amp;s=random">Random</a></li>
  <li><a href="mailto:staff@booru.org">Contact Us</a></li>
  <li><a href="mailto:dmca@booru.org">DMCA</a></li>
  <li><a href="index.php?page=about">About</a></li>
  <li><a href="index.php?page=help&amp;topic=post">Help</a></li>
  <li><a href="index.php?page=servermap">IMG Servers</a></li>
  <li><a href="index.php?page=toptags">TagMap</a></li>
  <li><a href="/tos.php">TOS</a></li>
</ul>
</body>`
const root = parse(test)
let els = root.querySelectorAll('.flat-list a')
console.log(els.map((el) => el.text))
