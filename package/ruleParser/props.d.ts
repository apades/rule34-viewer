import { Concat } from '@r/utils/typeUtils'

export type mainProps = {
  (
    key: Concat<'discover', 'url'>,
    props: {
      searchString: string
      pageLimit: number
      pageNum: number
    },
  ): Promise<string>
  (
    key: Concat<'discover', 'list'>,
    props: {
      searchString: string
      pageLimit: number
      pageNum: number
    },
  ): Promise<any[]>
  (
    key: Concat<'discover', 'cover'>,
    props: {
      $item: any
    },
  ): Promise<string>
  // ---content
  (
    key: Concat<'content', 'url' | 'image' | 'reffers'>,
    props: {
      id: number | string
      $item: any
    },
  ): Promise<string>
  (
    key: Concat<'content', 'tags'>,
    props: {
      id: number | string
      $item: any
    },
  ): Promise<{
    [k: string]: string[]
  }>
  (
    key: Concat<'content', 'getImg'>,
    props: {
      $index: number
      $item: any
    },
  ): Promise<{ img: string; isEnd: boolean }>
  (
    key: Concat<'content', 'getLen'>,
    props: {
      $item: any
    },
  ): Promise<number>
  (key: Concat<'content' | 'discover', 'type'>): Promise<'html' | 'json'>
}
