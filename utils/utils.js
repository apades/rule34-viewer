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

// expo hot reload生成list会报key问题
export function generRandomId(id) {
  return random(0, 10000) + id
}
