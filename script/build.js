const fs = require('fs')
const path = require('path')

let resolve = (...p) => path.resolve(__dirname, ...p)

async function main() {
  try {
    let envPath = resolve('../utils/env.js')
    let envTxt = fs.readFileSync(envPath, 'utf-8')

    envTxt = envTxt.replace(`import Constants from 'expo-constants'`, ``)
    envTxt = envTxt.replace(
      `export const _env = Constants.manifest.extra`,
      `export const _env = {
    NSFW: true,
  }`,
    )
    envTxt = envTxt.replace(
      `export const isDev = process.env.NODE_ENV === 'development'`,
      'export const isDev = false',
    )
    envTxt = envTxt.replace(
      `export const ip = Constants.linkingUri.match(
  /\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}/,
)[0]`,
      '',
    )
    fs.writeFileSync(envPath, envTxt, 'utf8')

    fs.unlinkSync(resolve('../app.config.js'))
  } catch (error) {
    console.error(`build脚本发生错误`, error)
  }
}

main()
