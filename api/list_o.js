import request from '../utils/reuqest'
import { parserXml } from '../utils/utils'

export async function imgList_o(option = {}) {
  let dataList
  try {
    let data = await request(
      'https://rule34.xxx/index.php?page=dapi&s=post&q=index',
      {
        params: {
          ...option,
        },
      }
    )
    dataList = data
    let root = parserXml(data)
    dataList = {
      count: root.attributes.count,
      offset: root.attributes.offset,
      dataList: root.children.map((el) => el.attributes),
    }
  } catch (error) {
    dataList = {
      count: 0,
      offset: 0,
      dataList: [],
    }
  }

  return dataList
}
