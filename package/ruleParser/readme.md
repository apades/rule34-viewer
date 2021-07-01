# 新的规则
```ts
/**
 * TODO 新的$. deepKeyData方式
 * {url: string
 * type?: 'html' | 'json' }
 * 这种应该被剔除，加入init hook，附带一个`save(props:{[k:string]:any})`方法
 * 在最外层`discover`传入`{test:{a:1,b:2}}`，
 * 在`discover`、`content`和`chapter`都可以使用"$test.a"取值
 */
type hookProps = {
  saveData: (data: { [k: string]: any }) => void
  $item: any
  request: AxiosInstance
  xmlParser: (xml: string) => query
}
type hook = (props: hookProps) => Promise<void>
```

# 特殊共同点
## 漫画
- 以dmzj和腾讯等为例
  - 首页有一些特殊的类别：**今日推荐、最近更新**，这些可以为动态key并套用discover列表，tag如**热血、悬疑**可以套在search/discover列表
  - 进入某一个漫画，有chapter列表页面
  - 最后才进入content页面
- 以ehview单chapter为例
  - 首页有一些特殊的类别：**排行**，同样，但这个重tag方向
  - 进入某一个漫画，但为单chapter，这里作为设置项，进入preview列表页面，具体和ehview一样
  - 最后才进入content页面