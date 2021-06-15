import getRuleResult, { setRequest, setRule } from '@r/package/ruleParser'
// TODO 替换？或者这是个默认的
import rule34Text from '@r/package/ruleParser/rules/rule34.text'
import { GalleryItem } from '@r/types/itemType'
import { Dp, GetState } from '@r/types/redux'
import { ip, isDev } from '@r/utils/env'
import request from '@r/utils/request'
import { rData } from '@r/views/gallery'

let _setRule = setRule
setRequest(request)
eval(`${rule34Text};_setRule(config)`)

export const getImageUrl =
  ($item: any) =>
  async (dispatch: Dp, getState: GetState): Promise<string> => {
    let uri = await getRuleResult('content.image', {
      id: $item.id,
      $item,
    })
    uri = isDev ? `http://${ip}:3001/proxy?url=${encodeURIComponent(uri)}` : uri

    return uri
  }

export const getCoverUrl =
  ($item: any) =>
  async (dispatch: Dp, getState: GetState): Promise<string> => {
    let uri = await getRuleResult('discover.cover', { $item })
    uri = isDev ? `http://${ip}:3001/proxy?url=${encodeURIComponent(uri)}` : uri
    return uri
  }

export const getMoreGalleyData =
  (option: { searchString: string; pageLimit: number; pageNum: number }) =>
  async (dispatch: Dp, getState: GetState): Promise<rData[]> => {
    let state = getState()
    let imgLikes = state.likes.imgs

    let list = await getRuleResult('discover.list', option)
    let resDataList: rData[] = await Promise.all(
      list.map(async (item: GalleryItem): Promise<rData> => {
        let id = `rule34_${item.id}`
        return {
          isLike: !!imgLikes[id],
          originData: item,
          content: await getImageUrl(item)(dispatch, getState),
          cover: await getCoverUrl(item)(dispatch, getState),
        }
      }),
    )
    return resDataList
  }

export const getContentOriginUrl =
  (option: { id: number; $item: any }) =>
  async (dispatch: Dp, getState: GetState): Promise<string> => {
    return getRuleResult('content.url', option)
  }

export const getContentTags =
  (option: { $item: any; id: number | string }) =>
  async (
    dispatch: Dp,
    getState: GetState,
  ): Promise<{ [k: string]: string[] }> => {
    return getRuleResult('content.tags', option)
  }
