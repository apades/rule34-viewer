import { dykey } from '@r/types'
import {} from 'lodash'
import { Linking } from 'react-native'
import { ParamType } from './typeUtils'

export function throttle(fn: () => void, time: number): () => void {
  let save = true
  return function () {
    if (!save) return false
    save = false
    setTimeout((...arg: any[]) => {
      fn.apply(this, ...arg)
      save = true
    }, time)
  }
}

/**
 * debounce(func, [wait=0], [options={}])
 *
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading edge of the timeout.
 * @param {cancelObj} [options.cancelObj='canceled'] Specify the error object to be rejected.
 * @returns {Function} Returns the new debounced function.
 */
export function debounceAsync<T extends any>(
  func: (...args: T[]) => void,
  wait = 0,
  { leading = false, cancelObj = 'canceled' } = {},
): (...args: T[]) => Promise<(...args: T[]) => void> {
  let timerId: number, latestResolve: any, shouldCancel: boolean

  return function (...args: T[]) {
    if (!latestResolve) {
      // The first call since last invocation.
      return new Promise((resolve, reject) => {
        latestResolve = resolve
        if (leading) {
          invokeAtLeading.apply(this, [args, resolve, reject])
        } else {
          timerId = setTimeout(
            invokeAtTrailing.bind(this, args, resolve, reject),
            wait,
          )
        }
      })
    }

    shouldCancel = true
    return new Promise((resolve, reject) => {
      latestResolve = resolve
      timerId = setTimeout(
        invokeAtTrailing.bind(this, args, resolve, reject),
        wait,
      )
    })
  }

  function invokeAtLeading(args: T[], resolve: any, reject: any) {
    func.apply(this, args).then(resolve).catch(reject)
    shouldCancel = false
  }

  function invokeAtTrailing(args: T[], resolve: any, reject: any) {
    if (shouldCancel && resolve !== latestResolve) {
      reject(cancelObj)
    } else {
      func.apply(this, args).then(resolve).catch(reject)
      shouldCancel = false
      clearTimeout(timerId)
      timerId = latestResolve = null
    }
  }
}

export function deurl(url = '') {
  let urlArr = url.split(/\/\/?/)
  let query = urlArr[urlArr.length - 1].split('?')[1]
  let queryMap: dykey = {}
  query?.split('&').forEach((q) => {
    let [key, value] = q.split('=')
    queryMap[key] = value
  })
  return {
    protocol: urlArr[0].replace(':', ''),
    domain: urlArr[1],
    query: queryMap,
  }
}

export function genHandlerScrollEnd(
  callback: (e: any) => void,
): (e: any) => void {
  return function handlerScrollEnd(e) {
    function isCloseToBottom({
      layoutMeasurement,
      contentOffset,
      contentSize,
    }: any) {
      return (
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 1
      )
    }
    if (isCloseToBottom(e.nativeEvent)) {
      callback(e)
    }
  }
}

export function handleOpenUrl(url: string): Promise<void> {
  return Linking.canOpenURL(url).then((can) => {
    if (can) Linking.openURL(url)
    else console.error(`can\'t open ${url}`)
  })
}

/**传入idList来清除传入列表的对应id列，优化版 */
export function clearListByIdList<T extends dykey>(
  list: T[],
  idList: (number | string)[],
  /**匹配list的key名称，默认id */
  key = 'id',
): T[] {
  return list.filter((d) => {
    let find = idList.findIndex((v) => v === d[`${key}`])
    if (find !== -1) {
      idList.splice(find, 1)
      return false
    }
    return true
  })
}

export let minmax = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v

export function getArrs<T>(arr: T[], index: number, len: number): T[] {
  let rs = []
  for (let i = index; i < index + len; i++) {
    if (arr[i] === undefined) return rs
    rs.push(arr[i])
  }
  return rs
}

/**
 * 用于一些不想一点击就直接弹出通知的地方，如果网络出现延迟则会弹出，网络通畅则不弹出
 * @param time 延迟时间
 * @returns {(cb?: (() => void)) => void}  传入函数为添加延迟运行函数，直接运行为清除该方法
 */
export let timmerOutTodo = (time = 500): ((cb?: () => void) => void) => {
  let end = false
  let fns: (() => void)[] = []
  let timmer: NodeJS.Timeout = setTimeout(() => {
    end = true
    fns.forEach((fn) => fn())
  }, time)
  return (cb?: () => void) => {
    // 传入boolean清除todo
    if (!cb) {
      timmer && clearTimeout(timmer)
      timmer = null
      return
    }
    if (!end) fns.push(cb)
    else cb()
  }
}

export function getValues<T extends dykey, B extends (keyof T)[]>(
  obj: T,
  arr: B,
): {
  [k in keyof T]?: ReturnType<T[k]>
} {
  let rs: {
    [k in keyof T]?: ReturnType<T[k]>
  } = Object.create({})
  arr.map((k) => {
    rs[k] = obj[k]
  })
  return rs
}

export function omitOjbect<T, K extends keyof T>(obj: T, key: K[]): Omit<T, K> {
  let rs = { ...obj }
  key.forEach((k) => delete rs[k])
  return rs
}

export function arrayInsert<T>(tarr: T[], index: number, arr: T[]): T[] {
  let _tarr = [...tarr]
  let left = _tarr.splice(0, index),
    right = _tarr

  return [...left, ...arr, ...right]
}

let logBoxDisableMap: {
  [key: string]: {
    color?: string
    disable?: boolean
  }
} = {}
let generRandomColor = (seed: number) =>
  `#${Math.floor(seed * 16777215).toString(16)}`

export function _logBox(key: string): typeof console {
  let _console = { ...console }
  let _log = console.log
  if (!logBoxDisableMap[key]) {
    let num: any = [...key]
      .map((t) => t.charCodeAt(0))
      .reduce((rs, val) => rs + val, 0)
      .toString()
      .split('')
      .reverse()
      .join('')

    num = num - 0
    while (num > 1) {
      num /= 10
    }
    logBoxDisableMap[key] = {
      color: generRandomColor(num),
    }
  }
  _console.log = (...arg: ParamType<typeof _log>) => {
    let data = logBoxDisableMap[key]
    !data.disable && _log(`%c${key}:`, `color:${data.color};`, ...arg)
  }
  return _console
}

_logBox.disable = function (keys: string[] | string) {
  if (!Array.isArray(keys)) keys = [keys]
  keys.forEach((k) => {
    logBoxDisableMap[k] = {
      disable: true,
    }
  })
}
