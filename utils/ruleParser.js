import lodash, { get } from 'lodash'
import parse from 'node-html-parser'

export function parserStringValue(string = '', obj = {}) {
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

export function evalScript(script, value) {
  let _rs
  let _value = value

  let scriptStr = `_rs=(${script})(_value)`
  let $q = () => {}
  // $q
  if (script.match(/^\(\{.*?(\$q).*?\}\)/)) {
    let root = parse(value)
    $q = function (queryStr) {
      let els = root.querySelectorAll(queryStr)
      return {
        text: () => els.map((el) => el.text),
      }
    }
    scriptStr = `_rs=(${script})({$q})`
  }
  eval(scriptStr)
  return _rs
}

export function executePaser(content = '', option, rs = '') {
  // @{} replace
  if (content.match(/@\{.*?\}/g)) return parserStringValue(content, option)
  // @js
  else if (content.indexOf('@js:') !== -1)
    return evalScript(content.replace('@js:', ''), option)
  // $.key1.key2 -> value
  else if (content.indexOf('$') === 0) return parserStringValue(option, content)

  return rs
}
