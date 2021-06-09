// TODO 临时用的request
import request from './request'
import { Concat, DeepLeafKeys, dykey, omitOjbect } from '../../utils/typeUtils'
import { get } from 'lodash'
import { RuleType } from './rules/type'

type baseProps<T> = T &
  Partial<{
    searchString: string
    pageLimit: number
    pageNum: number
    id: string | number
  }>

let rule: RuleType
export let setRule = (r: RuleType) => {
  rule = r
}
export let getRule = () => rule
let cacheMap = new Map()
let getCache = (key: string, cb: (val?: any) => void) =>
  cacheMap.has(key) ? cacheMap.get(key) : cb()

let getRuleResult: {
  (
    key: Concat<'discover', 'url'>,
    props: {
      searchString: string
      pageLimit: number
      pageNum: number
    },
  ): Promise<string>
  (
    key: Concat<'discover', 'list'>,
    props: {
      searchString: string
      pageLimit: number
      pageNum: number
    },
  ): Promise<any[]>
  (
    key: Concat<'discover', 'cover'>,
    props: {
      $item: any
    },
  ): Promise<string>
  // ---content
  (
    key: Concat<'content', 'url' | 'image' | 'reffers'>,
    props: any,
  ): Promise<string>
  (key: Concat<'content', 'tags'>, props: any): Promise<{
    [k: string]: string[]
  }>
  (key: Concat<'content' | 'discover', 'type'>): Promise<'html' | 'json'>
}

getRuleResult = async function (
  key: DeepLeafKeys<RuleType>,
  props?: baseProps<any>,
) {
  let rule = getRule()
  let ruleScript = get(rule, key)
  // init props
  let baseProps = {
    id: props.id,
    pageLimit: props.pageLimit ?? 20,
    pageNum: (rule.config?.pageNumStart ?? 0) + props.pageNum,
    searchString: props.searchString,
  }

  // rule init
  // omitOjbect(props, ['id', 'pageLimit', 'pageNum', 'searchString'])

  // --- execute string script
  function isString(input: string) {
    if (input[0] === '$') return executeDeepDataStringScript(props, input)
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
    dataBase: any,
  ) {
    path = path.replace(/\$\.?/, '')
    return path.length ? get(dataBase, path) : dataBase
  }
  // --- execute string script

  switch (key) {
    case 'discover.url':
      return executeAtStringScript(ruleScript, baseProps)
    case 'discover.list': {
      let url = executeAtStringScript(get(rule, 'discover.url'), baseProps)

      let res = await request(url)
      let list = []
      if (typeof ruleScript === 'string')
        list = executeDeepDataStringScript(ruleScript, res)
      if (typeof ruleScript === 'function') list = ruleScript(baseProps)
      return list
    }
    case 'discover.cover': {
      let cover = ''
      if (typeof ruleScript === 'string') cover = isString(ruleScript)
      if (typeof ruleScript === 'function') cover = ruleScript(props)
      return cover
    }
    case 'content.url':
    case 'content.image':
    case 'content.reffers': {
      return ''
    }
    case 'content.type':
    case 'discover.type': {
      return ruleScript
    }
  }
  throw new Error(`can't execute this script: ${key}`)
}

export default getRuleResult
