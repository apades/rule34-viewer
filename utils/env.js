import Constants from 'expo-constants'

export const _env = Constants.manifest.extra

export const ip = Constants.linkingUri.match(
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
)[0]

export const isDev = process.env.NODE_ENV === 'development'
