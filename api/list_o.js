import request from '../utils/request'
import { parserXml } from '../utils/utils'

function resolveData(data) {
  let root = parserXml(data)
  let rs = {
    count: root.attributes.count,
    offset: root.attributes.offset,
    dataList: root.children.map((el) => el.attributes),
  }
  return rs
}

export async function imgList_o(option = {}) {
  let dataList
  try {
    let data = await request('http://192.168.199.145:3001/getList', {
      params: {
        ...option,
      },
    })
    dataList = data
    // dataList = resolveData(data)
  } catch (error) {
    dataList = {
      count: 0,
      offset: 0,
      dataList: [],
    }
  }

  return dataList
}
