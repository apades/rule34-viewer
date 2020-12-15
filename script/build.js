const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

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

    // 打tag
    exec('git tag', (err, stdout, stderr) => {
      if (err) console.log('err', err)
      let verList = stdout.split(/\r|\n/)

      let newVerList = verList[verList.length - 2].split('.')
      newVerList[newVerList.length - 1] = +newVerList[newVerList.length - 1] + 1

      let newVer = newVerList.join('.')
      exec(`git tag ${newVer}`, (err, stdout, stderr) => {
        if (err) console.log('add tag error', err)
      })
    })
  } catch (error) {
    console.error(`build脚本发生错误`, error)
  }
}

main()
