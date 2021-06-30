import { DeepLeafKeys } from '@r/utils/typeUtils'
import { AxiosInstance } from 'axios'
import htmlParser from 'node-html-parser'

type dykey<T = any> = {
  [k: string]: T
}
export type RuleBaseConfig = Partial<{
  /**第一页开始数，默认为0*/
  pageNumStart: number
  /**一页个数，默认20 */
  pageLimit: number
}>

type RuleBaseFnProps = {
  searchString: string
  pageLimit: number
  pageNum: number
  /**默认最外层为数组，返回其中单个。如果不是，则需要设置discover.list */
  $item: any
  /**原始最外层数据 */
  $origin: any
  /**相当于css的dom选择器，content.type === 'html' 时可用 */
  query: query
  request: AxiosInstance
  xmlParser: (xml: string) => query
}
type RuleBaseFnOrStringProps<RT> =
  | ((props: RuleBaseFnProps) => RT)
  | ((props: RuleBaseFnProps) => Promise<RT>)
  | RT
  | string

type query = (q: string) => {
  list: query[]
  text: () => string[]
  attr: (key: string) => string[]
}
type RuleContentFnProps = RuleBaseFnProps & {
  id: string
  /**相当于css的dom选择器，content.type === 'html' 时可用 */
  $query: query
}
type RuleContentFnOrStringProps<RT> =
  | ((props: RuleContentFnProps) => RT)
  | ((props: RuleContentFnProps) => Promise<RT>)
  | RT
  | string

type RuleTypeBase = {
  name: string
  host: string

  /**主题色 */
  theme: string
  /**爬虫基本设置 */
  config?: RuleBaseConfig
}

type RuleGallery = RuleTypeBase & {
  /**类型 */
  contentType: 'gallery'

  discover: {
    url: string
    type?: 'html' | 'json'
    /**返回的值将成为$item */
    list: RuleBaseFnOrStringProps<any[]>
    cover: RuleBaseFnOrStringProps<string>
  }
  content: {
    /**如果设置，则单独爬该数据 */
    url?: string
    /**默认为json */
    type?: 'html' | 'json'
    image: RuleContentFnOrStringProps<string>
    tags: RuleContentFnOrStringProps<{ [k: string]: string[] }>
    reffers: RuleContentFnOrStringProps<string>
    originUrl: string
  }
}

type RuleManga = RuleTypeBase & {
  /**类型 */
  contentType: 'manga'

  discover: {
    url: string
    type?: 'html' | 'json'
    desc: RuleBaseFnOrStringProps<string>
    title: RuleBaseFnOrStringProps<string>
    author: RuleBaseFnOrStringProps<string[]>
    /**返回的值将成为$item */
    list: RuleBaseFnOrStringProps<any[]>
    cover: RuleBaseFnOrStringProps<string>
    tags?: RuleContentFnOrStringProps<{ [k: string]: string[] }>
  }
  search: RuleManga['discover']
  content: {
    /**如果设置，则单独爬该数据 */
    url?: RuleContentFnOrStringProps<string>
    /**默认为json */
    type?: 'html' | 'json'
    imageList?: RuleContentFnOrStringProps<string[]>
    getImg?: (props: {
      $item: any
      $index: number
      request: AxiosInstance
    }) => Promise<{
      img: string
      isEnd?: boolean
    }>
    tags?: RuleContentFnOrStringProps<{ [k: string]: string[] }>
    reffers?: RuleContentFnOrStringProps<string>
    originUrl?: string
  }
}
export type RuleType = RuleGallery | RuleManga
// export type RuleResultKeys = DeepLeafKeys<RuleResultKeysMap>
