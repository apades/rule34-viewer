import { GalleryItem } from '@r/types/itemType'
import { Dp, GetState } from '@r/types/redux'
import { ip, isDev } from '@r/utils/env'
import request from '@r/utils/request'
import {
  executePaser,
  parserItemValue,
  parserStringValue,
} from '@r/utils/ruleParser'
import { rData } from '@r/views/gallery'

export const getRequestUrl =
  (option: { searchString: string; pageLimit: number; pageNum: number }) =>
  (dispatch: Dp, getState: GetState): string => {
    let state = getState()
    let url = state.setting.rule.discover.url
    return parserStringValue(url, option)
  }

export const getImageUrl =
  (item: any) =>
  (dispatch: Dp, getState: GetState): string => {
    let state = getState()
    let imageScript = state.setting.rule.content.image
    let uri = executePaser(imageScript, { $i: item })
    uri = isDev
      ? `http://${ip}:3001/proxy-img?url=${encodeURIComponent(uri)}`
      : uri

    return uri
  }

export const getCoverUrl =
  (item: any) =>
  (dispatch: Dp, getState: GetState): string => {
    let state = getState()
    let coverScript = state.setting.rule.discover.cover
    let uri = executePaser(coverScript, item)
    uri = isDev
      ? `http://${ip}:3001/proxy-img?url=${encodeURIComponent(uri)}`
      : uri
    return uri
  }

export const getMoreGalleyData =
  (option: { searchString: string; pageLimit: number; pageNum: number }) =>
  async (dispatch: Dp, getState: GetState): Promise<rData[]> => {
    let state = getState()
    let listScript = state.setting.rule.discover?.list ?? '$',
      imgLikes = state.likes.imgs
    let requestUrl = getRequestUrl(option)(dispatch, getState)

    let res = await request(requestUrl)
    let resDataList: rData[] = parserItemValue(listScript, res).map(
      (item: GalleryItem): rData => {
        let id = `rule34_${item.id}`
        return {
          isLike: !!imgLikes[id],
          originData: item,
          content: getImageUrl(item)(dispatch, getState),
          cover: getCoverUrl(item)(dispatch, getState),
        }
      },
    )
    return resDataList
  }

export const getContentOriginUrl =
  (option: { id: number }) =>
  (dispatch: Dp, getState: GetState): string => {
    let rule = getState().setting.rule.content
    return rule.url
      ? executePaser(rule.url, option)
      : rule.originUrl
      ? executePaser(rule.originUrl, option)
      : ''
  }
