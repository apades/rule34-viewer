import XMLParser from 'react-xml-parser'

export function parserXml(xmlStr) {
  let xml = new XMLParser().parseFromString(xmlStr)
  return xml
}

export function resolveListByXml(dataStr) {
  let root = parserXml(dataStr)
  let rs = {
    count: root.attributes.count,
    offset: root.attributes.offset,
    dataList: root.children.map((el) => el.attributes),
  }
  return rs
}
