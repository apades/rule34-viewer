import { Dimensions } from 'react-native'

export const _env = {
  proxy_server: !!process.env.LOCALIP,
  NSFW: process.env.NSFW === 'true' || !isDev,
}

//
export const ip = process.env.LOCALIP

export const isDev = process.env.NODE_ENV === 'development'

let data = Dimensions.get('screen')
export const _screen = {
  width: data.width,
  height: data.height,
}
