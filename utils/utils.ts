import { dykey } from '@r/types'
import {} from 'lodash'
import { Linking } from 'react-native'

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
export function debounceAsync(
  func: () => void,
  wait = 0,
  { leading = false, cancelObj = 'canceled' } = {},
): () => Promise<void> {
  let timerId: number, latestResolve: any, shouldCancel: boolean

  return function (...args: any[]) {
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

  function invokeAtLeading(args, resolve, reject) {
    func.apply(this, args).then(resolve).catch(reject)
    shouldCancel = false
  }

  function invokeAtTrailing(args, resolve, reject) {
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
    }) {
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

let test1 = {
  a1: 'asda',
  b() {
    return 'asd'
  },
}

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B

type WritableKeys<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]

type DeepWritablePrimitive =
  | undefined
  | null
  | boolean
  | string
  | number
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
/**返回去除readOnly字段的type */
export type DeepWritable<T> = T extends DeepWritablePrimitive
  ? T
  : T extends Array<infer U>
  ? DeepWritableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepWritableMap<K, V>
  : T extends Set<infer T>
  ? DeepWriableSet<T>
  : DeepWritableObject<T>

type DeepWritableArray<T> = Array<DeepWritable<T>>
type DeepWritableMap<K, V> = Map<K, DeepWritable<V>>
type DeepWriableSet<T> = Set<DeepWritable<T>>

type DeepWritableObject<T> = {
  [K in WritableKeys<T>]: DeepWritable<T[K]>
}

/**Partial 特殊字段必须版 */
export type PartialExclude<A, B extends keyof A> = Partial<A> &
  {
    [K in B]: A[K]
  }
/**Partial 特殊字段选填版 */
export type PartialInclude<A, B extends keyof A> = Partial<A> &
  {
    [K in keyof Omit<A, B>]: A[K]
  }

export function omitOjbect<T, K extends keyof T>(obj: T, key: K[]): Omit<T, K> {
  let rs = { ...obj }
  key.forEach((k) => delete rs[k])
  return rs
}
