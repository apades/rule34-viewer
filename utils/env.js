import { Dimensions } from 'react-native'

export const isDev = process.env.NODE_ENV === 'development'

export const _env = {
  proxy_server: !!process.env.LOCALIP,
  NSFW: process.env.NSFW === 'true' || !isDev,
}

export const ip = process.env.LOCALIP
let data = Dimensions.get('screen')
export const _screen = {
  width: data.width,
  height: data.height,
}
