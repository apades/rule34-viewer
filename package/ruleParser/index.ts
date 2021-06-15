// TODO 临时用的request
// import request from './request'
import { Concat, DeepLeafKeys, dykey, omitOjbect } from '../../utils/typeUtils'
import htmlParser from 'node-html-parser'
import { get } from 'lodash'
import { RuleType } from './rules/type'
import { AxiosInstance } from '@r/proxy_server/node_modules/axios'

type baseProps<T> = T &
  Partial<{
    searchString: string
    pageLimit: number
    pageNum: number
    id: string | number
  }>
let request: AxiosInstance = null
export let setRequest = (req: AxiosInstance) => (request = req)
let getRequeset = () => request

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
    props: {
      id: number | string
      $item: any
    },
  ): Promise<string>
  (
    key: Concat<'content', 'tags'>,
    props: {
      id: number | string
      $item: any
    },
  ): Promise<{
    [k: string]: string[]
  }>
  (key: Concat<'content' | 'discover', 'type'>): Promise<'html' | 'json'>
}

getRuleResult = async function (
  key: DeepLeafKeys<RuleType>,
  props?: baseProps<any>,
) {
  let request = getRequeset()
  if (!request) return Promise.reject('未初始化request')
  let rule = getRule()
  let ruleScript = get(rule, key)
  let isString = typeof ruleScript === 'string',
    isFn = typeof ruleScript === 'function'
  // ----init props----
  let baseProps = {
    id: props.id,
    pageLimit: props.pageLimit ?? 20,
    pageNum: (rule.config?.pageNumStart ?? 0) + props.pageNum,
    searchString: props.searchString,
  }

  // ----content type:'html' init----
  let $root: ReturnType<typeof htmlParser>,
    $query = function (queryStr: string) {
      let els = $root.querySelectorAll(queryStr)
      return {
        text: () => els.map((el) => el.text),
      }
    }
  if (
    key !== 'content.url' &&
    key.indexOf('content.') === 0 &&
    get(rule, 'content.type') === 'html'
  ) {
    let url = await getRuleResult('content.url', props)
    let htmlString = (await request(url)) as any as string
    $root = htmlParser(htmlString)
  }

  // ----execute string script----
  function stringRunner(input: string) {
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

  // ----execute html crawl----
  function htmlCrawlRunner(htmlString: string) {
    let root = htmlParser(htmlString)
  }

  switch (key) {
    case 'discover.url':
      return executeAtStringScript(ruleScript, baseProps)
    case 'discover.list': {
      let url = await getRuleResult('discover.url', props)

      let res = await request(url)
      let list = []
      if (isString) list = executeDeepDataStringScript(ruleScript, res)
      if (isFn) list = ruleScript(baseProps)
      return list
    }
    case 'discover.cover': {
      let cover = ''
      if (isString) cover = stringRunner(ruleScript)
      if (isFn) cover = ruleScript(props)
      return cover
    }
    // -----content-----
    case 'content.url': {
      if (!ruleScript) {
        ruleScript = get(rule, 'content.originUrl')
        isString = typeof ruleScript === 'string'
        isFn = typeof ruleScript === 'function'
      }
      if (isString) return executeAtStringScript(ruleScript, props)
      if (isFn) return ruleScript(props)
      return ''
    }
    case 'content.image': {
      if (isString) return stringRunner(ruleScript)
      if (isFn) return ruleScript(props)
      return ''
    }
    case 'content.reffers': {
      return ''
    }
    case 'content.tags': {
      if (isFn) return ruleScript({ ...props, $root, $query })
      if (isString) return executeDeepDataStringScript(ruleScript, props.$item)
      return {}
    }
    // ----chore----
    case 'content.type':
    case 'discover.type': {
      return ruleScript
    }
  }
  throw new Error(`can't execute this script: ${key}`)

  // return mainRunner(key)
}

export default getRuleResult
