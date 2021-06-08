import { Concat, DeepLeafKeys, dykey, omitOjbect } from '@r/utils/typeUtils'
import { get } from 'lodash'
import { RuleResultKeysMap, RuleType } from './rules/type'
import parse from 'node-html-parser'

type baseProps<T> = T &
  Partial<{
    searchString: string
    pageLimit: number
    pageNum: number
    id: string | number
  }>

let rule: RuleType
export let setRule = (r: RuleType) => (rule = r)
export let getRule = () => rule

function getRuleResult(key: Concat<'discover', 'url'>, props: any): string
function getRuleResult(key: Concat<'discover', 'cover'>, props: any): string
function getRuleResult(
  key: Concat<'content', 'url' | 'image' | 'reffers'>,
  props: any,
): string
function getRuleResult(
  key: DeepLeafKeys<RuleResultKeysMap>,
  props?: baseProps<any>,
) {
  // init props
  let baseProps = omitOjbect(props, [
    'id',
    'pageLimit',
    'pageNum',
    'searchString',
  ])
  let ruleScript = get(rule, key)

  // --- execute string script
  function isString(input: string) {
    if (input[0] === '$') return executeDeepDataStringScript(input, baseProps)
    else return executeAtStringScript(input, baseProps)
  }
  function executeAtStringScript(string: string = ruleScript, obj: dykey = {}) {
    let keyArr = string.match(/@\{.*?\}/g)
    keyArr.forEach(
      (key) =>
        (string = string.replace(`${key}`, obj[key.replace(/[\@\{\}]/g, '')])),
    )
    return string
  }
  function executeDeepDataStringScript(
    path: string = ruleScript,
    dataBasePath: any,
  ) {
    return get(get(props, dataBasePath), path)
  }
  // --- execute string script

  switch (key) {
    case 'discover.url':
      return executeAtStringScript(ruleScript, baseProps)
    case 'discover.cover': {
      if (typeof ruleScript === 'string') return isString(ruleScript)
      if (typeof ruleScript === 'function') return eval(ruleScript)
      return ''
    }
    case 'content.url':
    case 'content.image':
    case 'content.reffers': {
      return ''
    }
  }
  throw new Error(`can't execute this script: ${key}`)
}
