# 关于request的设置
分为两个
- gallery
- detail

## 共有变量
| 变量名          | 说明                           | setting require | default      |
| --------------- | ------------------------------ | :-------------: | ------------ |
| pageNum         | 一页的数量                     |                 | 20           |
| tags            | 当前gallery的tags参数          |                 |              |
| page            | 当前页数                       |                 |              |
| ----            | ----                           |      ----       | ---          |
| gallery.url     | 获取列表元素API                |        *        |              |
| item            | `gallery.url`子元素            |                 |              |
| gallery.img     | 显示在view-gallery里的图片     |        *        |              |
| ----            | ----                           |      ----       | ---          |
| detail.url      | view-detail页API               |                 | 继承item     |
| detail.img      | 显示在view-detail里的图片      |        *        |              |
| -.tags.key      | tags在item中的key              |                 | ${item.tags} |
| -.tags.callback | 定制化函数，返回{key:string[]} |                 |              |
| -.tags.reg      | 针对特殊切割字符               |                 |              |



- pageNum   一页的数量
- tags      当前gallery的tags参数
- page      当前页数
- gallery.url   *   