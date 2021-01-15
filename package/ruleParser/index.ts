import { get } from 'lodash'
import parse from 'node-html-parser'
import Axios from 'axios'
import { dykey } from './types'
import { $q, RuleDetailProps, RuleProps } from './types'

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

export function createRuleParser(
  rule: RuleProps,
): {
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
      let res = (await Axios(url)).data

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
        let res = (await Axios(url)).data
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
