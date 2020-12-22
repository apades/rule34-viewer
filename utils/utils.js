import {} from 'lodash'
import { Linking } from 'react-native'
import XMLParser from 'react-xml-parser'

export function parserXml(xmlStr) {
  let xml = new XMLParser().parseFromString(xmlStr)
  return xml
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

export function handleOpenUrl(url) {
  return Linking.canOpenURL(url).then((can) => {
    if (can) Linking.openURL(url)
    else console.error(`can\'t open ${url}`)
  })
}
