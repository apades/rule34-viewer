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

// function _executePaser<T>(type:''):T
// export function _executePaser<T>(type:string,script:string):T{

// }
export function _evalScript(script: string, props: dykey): string {
  let _rs
  let _props = props

  let scriptStr = `_rs=(${script.replace('@js:', '')})(_props)`
  eval(scriptStr)
  return _rs
}
function _executePaser(script: string, data: dykey, keyData?: dykey): any {
  if (/^@js/.test(script)) return _evalScript(script, data)
  if (/^\$/.test(script)) return parserItemValue(script, data.$)
  if (script.match(/@\{.*?\}/)) return parserStringValue(script, keyData)

  return ''
}

export type DetailProps = {
  // id: number
  index: number
}
export type ListProps = {
  listName: string
  pid: number | string
}
type EvalListProps = {
  $: dykey[]
  $q?: $q
}
type EvalItemProps = {
  $?: dykey
  $q?: $q
  $list: dykey[]
  $i: dykey
}
type ListData = {
  data: dykey
  cover: string
}

export function createRuleParser(rule: RuleConfig): {
  getListData(props: ListProps): Promise<ListData[]>
  getDetailData(props: DetailProps): Promise<RuleDetailProps>
} {
  let list: ListData[] = [],
    listRoot: ReturnType<typeof parse> = null,
    itemRoot: ReturnType<typeof parse> = null

  let $q = (root: ReturnType<typeof parse>) => (queryStr: string) => {
    let els = Array.from(root.querySelectorAll(queryStr))
    return {
      text: () => els.map((el) => el.text),
      attr: (key: string) => els.map((el) => el.getAttribute(key)),
    }
  }

  return {
    async getListData(props: ListProps): Promise<ListData[]> {
      let rlist = rule.list

      let url = parserStringValue(rlist.url, props)
      let res = (await request(url)).data

      // let resList: dykey[] = []
      let dataProps: EvalListProps = {
        $: [],
      }
      switch (rlist.gtype) {
        case 'json': {
          dataProps.$ = _executePaser(rlist.list, {
            $: res,
          }) as dykey[]
          break
        }
        case 'xml': {
          listRoot = parse(res)
          dataProps.$q = $q(listRoot)
          dataProps.$ = _executePaser(rlist.list, dataProps) as dykey[]
          break
        }
      }

      let _list: ListData[] = dataProps.$.map((d, i) => {
        let itemDataProps: EvalItemProps = {
          $i: dataProps.$[i],
          $list: dataProps.$,
        }
        return {
          data: d,
          cover: _executePaser(rlist.cover, itemDataProps) as string,
        }
      })

      list.push(..._list)
      return list
    },
    async getDetailData(props: DetailProps): Promise<RuleDetailProps> {
      let rdetail = rule.detail,
        dataProps: EvalItemProps = {
          $list: list,
          $i: list[props.index].data,
        }
      if (rdetail.url) {
        let url = parserStringValue(rdetail.url, {
          id: list[props.index],
        })
        let res = (await request(url)).data
        switch (rdetail.gtype) {
          case 'json': {
            dataProps.$ = res
            break
          }
          case 'xml': {
            itemRoot = parse(res)
            dataProps.$q = $q(itemRoot)
            break
          }
        }
      }

      return {
        ctype: rdetail.ctype,
        image: _executePaser(rdetail.image, dataProps),
      }
    },
  }
}
