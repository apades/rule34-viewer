import Constants from 'expo-constants'
import { Dimensions } from 'react-native'

export const _env = Constants.manifest.extra
// export const _env = {
//   NSFW: true,
// }

export const ip = Constants.linkingUri.match(
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
)[0]

export const isDev = process.env.NODE_ENV === 'development'
// export const isDev = false

let data = Dimensions.get('screen')
export const _screen = {
  width: data.width,
  height: data.height,
}
