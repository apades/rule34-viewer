# 遇到的问题
- [x] 觉得viewer应该改成pixiv那样的，就能比较好显示tag
- [x] 然后再加个view-imgDetail
- 功能性bug 扩展
  - [x] `app.js`不应该为tab nav
  - [x] `gallery`应该是一个单独的page，从`detail`点击tag到`gallery`应该是push一个`gallery`进去的
  - 需要考虑`home`怎么搞
  - [x] 需要考虑`search`怎么搞
    - 目前有一套方案，`gallery`上方为`search`，操作后该`gallery`被replace
- [x] `AutoHeightImage`需要有个未加载组件
# 功能

1. tags
   1. [x] 收藏
   2. 新数量提醒
2. item
   1. [x] 收藏
   2. 收藏分类
3. [x] 收藏本地存储化
4. img浏览
   1. [x] 接入gallery点击
   2. ~~从`/imgLisg/:tags/:page`到`/imgDetail/:tags/:id`，默认显示`:id`item，左右滑动以`:tags`dataList上下切换，回退直接到`/imgLisg/:tags/:page`，**这里滑动不记录router**，这里需要reducer记录下来`:tags`的dataList~~
      - [x] 基本功能
      - 需要提前把`:tags`的dataList记录到reducer中，detail页读取到某个节点，开始请求上/下一页的`:tags`的dataList
5. view-collections
   1. [x] 重构tags显示
   2. [x] 增加img-likes显示
   3. 增加tags新数量提醒
      1. 本地浏览最新的记录
      2. 请求根据差数显示在tags的chip里
6. view-detail
   1. [x] tag-container
   2. [x] reffer-container
   3. [x] 高级tag功能
7. view-setting
   1. [x] 设置开启高级tag功能
   2. [ ] log记录
8. comp-debugInfo
   1. [ ] 完善detail

## 1.0 基本功能
1. [x] tag、img收藏
2. [x] 搜索tag
3. [x] 显示详情的img，以及他的附带信息
4. [x] 本地存储

## 1.0+ 功能
1. 搜索历史列表
2. 接入其他接口或者服务端渲染页面的高级功能
   1. 这里可以用`webView`相互通信脚本
3. 新数量提醒
4. tag、img分类
# 发现的bug
## ~~多次刷新~~
```js
getLike: (id) => state.likes.imgs[id],
```
这个导致了重新把列表刷新了一遍

## ~~gallery搜索切换~~
从gallery搜索的tag进去新的gallery，在进去这个新tag的viewer后，返回旧的gallery的viewer会报错

## ~~navigation的bug~~
> 先暂时用了不好的方法解决了
> `navigation.goBack()`

### 搜索bug
使用搜索进入新的gallery会**叠加一次**gallery的loadData，从collect进去就没问题

### fristLoad bug
应该更`搜索bug`相关联，现在他也一直卡住加载中状态

问题出在了`navigation.replace('home', { redirect: 'gallery' })`地方

## 从detail->gallery的问题
detail的like到gallery里，like显示不正常

## ~~功能性bug~~
由于用的search-text reducer，只能存在一个gallery页，从detail的tag到gallery无法返回到之前的detail

## ~~`file_url`时效性~~
从API里获取的`file_url`有时效性，可能需要去除顶级域名显示

## `img-likes`顺序问题
添加的img显示并**不是顺序的**，可能需要修改reducer的likes

------
object的number key会自动排序，而Map不会
