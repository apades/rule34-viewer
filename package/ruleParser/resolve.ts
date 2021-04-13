import { isDev, ip } from '@r/utils/env'
import request from '@r/utils/request'
import { executePaser } from '@r/utils/ruleParser'
import { DetailData } from '@r/views/detail'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function resolveDetailData(rule: any, data: any): DetailData {
  let tags
  if (rule.content.url) {
    let requestUrl = executePaser(rule.content.url, {
      id: data.id,
    })
    request(requestUrl).then((res) => {
      tags = executePaser(rule.content.tags, res)
    })
  } else {
    tags = executePaser(rule.content.tags, data)
  }
  return {
    id: data.id,
    uri: executePaser(rule.content.image, { $i: data }),
    originUrl: `https://rule34.xxx/index.php?page=post&s=view&id=${data.id}`,
    tags,
  }
}

export function resolveCover(rule: any, data: any): string {
  let uri = executePaser(rule.discover.cover, data)
  uri = isDev
    ? `http://${ip}:3001/proxy-img?url=${encodeURIComponent(uri)}`
    : uri
  return uri
}
