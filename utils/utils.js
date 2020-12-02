// import { xml2json } from 'xml-js'
// import cheerio from 'cheerio'
// cheerio没法在rn里用
import { isArray, isPlainObject, random } from 'lodash'
import XMLParser from 'react-xml-parser'
var cheerio = () => {}

export function parserXml(xmlStr) {
  let xml = new XMLParser().parseFromString(xmlStr)
  return xml
}

export function Html2Query(HTMLstr) {
  return cheerio.load(HTMLstr)
}

export function loadHtml(html) {
  let $ = Html2Query(html)
  /**
   * @param {string} q
   * @param {string|string[]} attr
   * @param {boolean} childQ
   */
  function query(q, attr, childQ = false) {
    let doms = $(q).toArray()
    let rs

    function getAttr(doms, attr) {
      let rs = doms.map((dom) => {
        // 对象attr
        if (isPlainObject(attr)) {
          let _$ = $(dom)
          return Object.entries(attr).reduce((obj, [key, value]) => {
            obj[key] = (value && _$.attr(value)) || _$.text()
            return obj
          }, {})
        }
        // 数组attr
        if (isArray(attr)) {
          let _$ = $(dom)
          return attr.reduce((obj, key) => {
            obj[key] = _$.attr(key)
            return obj
          }, {})
        }
        // 单attr
        return $(dom).attr(attr)
      })
      return rs
    }
    // 取子
    if (childQ) {
      rs = doms.map((dom) => {
        let $1 = $(dom)
        return attr.reduce((obj, ac) => {
          let doms = (ac.q && $1.children(ac.q).toArray()) || $1.toArray()
          let rs = getAttr(doms, ac.attr)
          return {
            ...obj,
            ...rs[0],
          }
        }, {})
      })
    }
    // 取attr
    else if (attr) {
      rs = getAttr(doms, attr)
    }
    // 取
    else {
      rs = doms.map((dom) => $(dom).text())
    }

    return rs
  }
  query.$ = $
  return query
}

export function throttle(fn, time) {
  let save = true
  return function () {
    if (!save) return false
    save = false
    setTimeout(() => {
      fn.apply(this, arguments)
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
  func,
  wait = 0,
  { leading = false, cancelObj = 'canceled' } = {},
) {
  let timerId, latestResolve, shouldCancel

  return function (...args) {
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

// expo hot reload生成list会报key问题
export function generRandomId(id) {
  return random(0, 10000) + id
}

export function deurl(url = '') {
  let urlArr = url.split(/\/\/?/)
  let query = urlArr[urlArr.length - 1].split('?')[1]
  let queryMap = {}
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

export function genHandlerScrollEnd(callback) {
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
