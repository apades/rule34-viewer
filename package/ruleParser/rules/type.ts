export type RuleBaseConfig = Partial<{
  /**第一页开始数，默认为0*/
  pageNumStart: number
  /**一页个数，默认20 */
  pageLimit: number
}>

type RuleBaseFnProps = {
  /**默认最外层为数组，返回其中单个。如果不是，则需要设置discover.list */
  $item: any
  /**原始最外层数据 */
  $origin: any
  /**相当于css的dom选择器，content.type === 'html' 时可用 */
  $query: query
}
type RuleBaseFnOrStringProps<RT> = (props: RuleBaseFnProps) => RT | string

type query = (q: string) => {
  text: () => string
  attr: (key: string) => string[]
}

type RuleContentFnProps = RuleBaseFnProps & {
  /**相当于css的dom选择器，content.type === 'html' 时可用 */
  $query: query
}
type RuleContentFnOrStringProps<RT> = (props: RuleContentFnProps) => RT | string

export type RuleType = {
  name: string
  host: string

  /**主题色 */
  theme: string
  /**爬虫基本设置 */
  config?: RuleBaseConfig

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

// export type RuleResultKeys = DeepLeafKeys<RuleResultKeysMap>
