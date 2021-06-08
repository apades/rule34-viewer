import { get } from 'lodash'
import parse from 'node-html-parser'
import { dykey } from '../types/index'
import { $q, RuleDetailProps, RuleConfig } from '../types/rule'
import request from './request'

export function parserStringValue(string = '', obj: dykey = {}): string {
  // console.log('parserStringValue', string, Object.keys(obj))
  let keyArr = string.match(/@\{.*?\}/g)
  keyArr.forEach(
    (key) =>
      (string = string.replace(`${key}`, obj[key.replace(/[\@\{\}]/g, '')])),
  )
  return string
}

export function parserItemValue(path = '', data: dykey = {}): any {
  let v = { $: data }
  return get(v, path)
}

export function evalScript(script: string, value: string): string {
  let _rs
  let _value = value

  let scriptStr = `_rs=(${script})(_value)`
  let $q: (...r: any) => any = () => 1
  // $q
  if (script.match(/^\(\{.*?(\$q).*?\}\)/)) {
    let root = parse(value)
    $q = function (queryStr: string) {
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

export function executePaser(content = '', option: any, rs = ''): any {
  // @{} replace
  if (content.match(/@\{.*?\}/g)) return parserStringValue(content, option)
  // @js
  else if (content.indexOf('@js:') !== -1)
    return evalScript(content.replace('@js:', ''), option)
  // $.key1.key2 -> value
  else if (content.indexOf('$') === 0) {
    if (Object.keys(option).includes('$i')) {
      return parserItemValue(content, option.$i)
    } else return parserItemValue(content, option)
  }

  return rs
}
