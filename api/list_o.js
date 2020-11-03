import { isDev } from '../utils/env'
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
    if (isDev) {
      console.log('dev')
      dataList = await request('/getList', {
        params: {
          ...option,
        },
      })
    } else {
      let data = await request(
        'https://rule34.xxx/index.php?page=dapi&s=post&q=index',
        {
          params: {
            ...option,
          },
        },
      )
      dataList = resolveData(data)
    }
  } catch (error) {
    console.error('imgList error', error)
    dataList = {
      count: 0,
      offset: 0,
      dataList: [],
    }
  }

  return dataList
}
