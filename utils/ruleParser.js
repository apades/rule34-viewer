import lodash, { get } from 'lodash'

export function parserStringValue(string = '', obj = {}) {
  // let _obj = Object.keys(obj).reduce(
  //   (rs, key) => (rs[`@{${key}}`] = obj[key]),
  //   {},
  // )
  // console.log(_obj, obj)
  let keyArr = string.match(/@\{.*?\}/g)
  keyArr.forEach(
    (key) =>
      (string = string.replace(`${key}`, obj[key.replace(/[\@\{\}]/g, '')])),
  )
  return string
}

export function parserItemValue(data, path = '') {
  let v = { $: data }
  return get(v, path)
}

export function evalScript(script, ...value) {
  let _rs
  let scriptStr = `_rs=(${script})(${value
    .map((v) => {
      if (lodash.isObject(v)) return JSON.stringify(v)
      return v
    })
    .join(',')})`
  eval(scriptStr)
  return _rs
}

export function executePaser(content = '', option) {
  if (content.indexOf('@js:') !== -1)
    return evalScript(content.replace('@js:', ''), option)
}
