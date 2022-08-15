import fs from 'react-native-fs'
import { ParamType } from './typeUtils'

export let getBasePath = () => fs.ExternalStorageDirectoryPath
export let getAppRootUri = () => `${getBasePath()}/r34-viewer`
export async function writeFile(...arg: ParamType<typeof fs['writeFile']>) {
  return fs.writeFile(`${getBasePath()}${arg[0]}`, arg[1], arg[2])
}

export async function readFile(...arg: ParamType<typeof fs['readFile']>) {
  return fs.readFile(`${getBasePath()}${arg[0]}`, arg[1])
}

export async function readDir(...arg: ParamType<typeof fs['readDir']>) {
  return fs.readDir(`${getBasePath()}${arg[0]}`)
}

export async function mkdir(...arg: ParamType<typeof fs['mkdir']>) {
  return fs.mkdir(`${getBasePath()}${arg[0]}`)
}

export async function initAppFolder() {
  let rootUri = getAppRootUri()
  let isRootExist = await fs.exists(rootUri)
  if (!isRootExist) {
    console.log('init app folder')
    await fs.mkdir(rootUri)
    await fs.mkdir(rootUri + '/rules')
  }
  return isRootExist
}
export async function getRuleList() {
  let fileList = await fs.readDir(`${getAppRootUri()}/rules`)
  return fileList.filter((f) => f.isFile).map((f) => f.name)
}
