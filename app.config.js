import fs from 'fs'
import dotenv from 'dotenv'

let envConfig = {}
if (process.env.ENV_NAME) {
  let envText = fs.readFileSync(`./env/.env.${process.env.ENV_NAME}`, 'utf-8')
  envConfig = dotenv.parse(envText)
}

// console.log('env', envConfig)

let config = {
  name: 'CoolApp',
  version: '1.0.0',
  extra: {
    ...envConfig,
  },
}

export default config

// 使用方法
// import Constants from 'expo-constants'
// console.log('test', Constants.manifest.extra.enableComments)
