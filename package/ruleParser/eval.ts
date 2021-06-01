import { get } from 'lodash'
import { dykey } from 'types'
import { RuleEvalType } from './types'

function parserItemValue<T>(path = '', data: any): T {
  let v = { $: data }
  return get(v, path)
}

export function evalScript<T>(script: string, props: dykey): T {
  let _rs
  let _props = props

  let scriptStr = `_rs=(${script.replace('@js:', '')})(_props)`
  eval(scriptStr)
  return _rs
}

// export type Script2fnReturnType = {
//   type: 'js'
//   fn: ReturnType<typeof parserItemValue>
// }
export const script2fn = <T extends dykey[] | dykey>(
  script: RuleEvalType,
  data: any,
): T => {
  switch (script.type) {
    case 'json': {
      let rs = parserItemValue<T>(script.code, data)
      return rs
    }
    case 'js': {
      let rs = evalScript<T>(script.code, data)
      return rs
    }
  }
}
