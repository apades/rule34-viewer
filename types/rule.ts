import { dykey } from './index'

export type RuleTemplate = 'list'
export type RuleGetType = 'xml' | 'json'
export type RuleContentType = 'image' | 'manga' | 'text'
export type RuleListPros = {
  /** 请求的url，只支持@{}标记符
   *
   * 变量有 listName pid
   */
  url: string
  /** 请求得到数据的解析类型，xml和html统称xml */
  gtype?: RuleGetType
  /** 从url和gtype解析出来的数据，提取为目标list的数据，默认数据为url获取的
   *
   * list支持类型@js: params: $-url请求到的原始数据 $q-gtype:xml，目前xml模式**必须用@js**
   *
   * $: json模式-$.target.data */
  list?: string
  // | {
  //     $: any[]
  //     $q: $q
  //   }
  /** 从list的单个数据提取封面图
   *
   * list支持类型 */
  cover?: string
}
export type RuleDetailProps = {
  url?: string
  gtype?: RuleGetType
  ctype: RuleContentType
  tags?: string
} & {
  ctype: 'image' | 'manga'
  image: string
}

// TODO rule规则定义问题
// 如果像现在这种rule全是string，开发插件会很难用，并没有语法提示
// 后续应该 rule:RuleProps -> _rule:RuleParserProps -> parser(_rule)
export type RuleProps = {
  name: string
  home?: {
    template?: RuleTemplate
  }
  /** 列表页面 */
  list: RuleListPros
  /** @js新增变量$i：为list中当前的数据，$list为list的数据 */
  detail: RuleDetailProps
  search?: {
    /** 自动补全词条/预搜索 */
    autoComplete?: {
      url: string
      /** 与list.list相同 */
      list?: string
      label: string
      value: string
    }
    /** 点击搜索后触发，必须为@js:(search:string)=>string */
    onSearch?: string
  }
}

// TODO 定义新rule ts用户版本的Props
export type $q = (
  selector: string,
) => {
  text: () => string[]
  attr: (key: string) => string[]
}
export type ListProps = { $: dykey[] }
export type ItemProps = { $i: dykey; $list: dykey[]; index: number }
export type HtmlTypeProps = { $q: $q }

export type _RuleProps = {
  name: string
  home?: {
    template?: RuleTemplate
  }
  list: {
    url: string
  } & (
    | {
        gtype?: 'json'
        list?: string | ((props: ListProps) => dykey[])

        cover?: string | ((props: ListProps & ItemProps) => dykey[])
      }
    | {
        gtype?: 'xml'
        list?: string | ((props: ListProps & HtmlTypeProps) => dykey[])

        cover?:
          | string
          | ((props: ListProps & ItemProps & HtmlTypeProps) => dykey[])
      }
  )

  detail: RuleDetailProps
  search?: {
    autoComplete?: {
      url: string
      list?: string
      label: string
      value: string
    }
    onSearch?: string
  }
}

// let a: _RuleProps = {
//   detail: {},
//   list: {
//     url: 'asda',
//   },
// }

// TODO 定义新rule ts解析版本的Props
// tempString感觉应该去掉，毕竟都可以用function提示
type RuleUrlType = {
  data: string
  type: 'js' | 'json' | 'tempString'
}
type RuleDataType = {
  data: string
} & (
  | {
      gtype: 'xml'
      type: 'js' | 'tempString'
    }
  | {
      gtype: 'json'
      type: 'js' | 'json' | 'tempString'
    }
)
export type RuleParserProps = {
  list: {
    url: RuleUrlType
    list: RuleDataType
    cover: RuleDataType
  }
}

export let testrule34: RuleProps = {
  name: 'rule34',
  list: {
    url:
      'https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=@{listName}&limit=20&pid=@{pid}',
    gtype: 'json',
    list: '$',
    cover:
      "@js:({$i})=>`https://rule34.xxx/thumbnails/${$i.directory}/thumbnail_${$i.image.replace(/^(.*)\\..*?$/,'$1.jpg')}`",
  },
  detail: {
    url: 'https://rule34.xxx/index.php?page=post&s=view&id=@{id}',
    gtype: 'xml',
    ctype: 'image',
    image:
      '@js:({$i})=>`https://rule34.xxx/images/${$i.directory}/${$i.image}`',
    tags:
      "@js:({$q})=>({ copyright:$q('.tag-type-copyright a').text(),character:$q('.tag-type-character a').text(),artist:$q('.tag-type-artist a').text(),general:$q('.tag-type-general a').text(),metadata:$q('.tag-type-metadata a').text()})",
  },
}

let data = {
  data: {
    directory: '3756',
    hash: '6b69df86235f4756215a516c11a73659',
    height: 776,
    id: 4250592,
    image: 'fbd7bff36a23962f9de39a9b8f07145052128120.png',
    change: 1606007482,
    owner: 'bot',
    parent_id: 0,
    rating: 'explicit',
    sample: true,
    sample_height: 587,
    sample_width: 850,
    score: 6,
    tags:
      '2020 anal anal_sex anthro bodily_fluids closed_eyes dacad duo eeveelution english_text genital_fluids genitals knot male male/male male_penetrated male_penetrating male_penetrating_male monochrome nintendo penetration penis pok&eacute;mon_(species) pokemon precum sketch sylveon text video_games',
    width: 1123,
  },
  cover:
    'https://rule34.xxx/thumbnails/3756/thumbnail_fbd7bff36a23962f9de39a9b8f07145052128120.jpg',
}
