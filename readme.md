# lib
## ui
[react-native-paper](https://callstack.github.io/react-native-paper/index.html)

## router
[React Navigation](https://reactnavigation.org/)

## viewer
[react-native-image-viewer](https://github.com/ascoders/react-native-image-viewer)

## grid-view
[gridView](https://www.npmjs.com/package/react-native-super-grid)

# 遇到的问题

<!-- - `sample_url`和`file_url`指向不同的url
- **[false]上面两个有些不是真实图片地址**
  - [x] 可能需要单独写个爬虫，目前页面是php，img标签已经暴露了url，直接指向图片
  - 还是上面的问题，**有些还有更高清的选项，需要把这部分单独弄出来**
  - **这里发现了个问题**
    - 问题`file_url`地址，http 302：https://hk.rule34.xxx/images/2731/f7db3e7b9f15d81bee7d5f634cd1ffec4b136caf.gif
    - 真实地址：https://hk.rule34.xxx//images/2731/f7db3e7b9f15d81bee7d5f634cd1ffec4b136caf.gif images前面多加个 **/**
    - [x] 但还是需要爬虫，**api给的tags不分类的**
    - [x] **妈的憨批竟然url规则还变的，一会`https://hk.rule34.xxx/images//**`，一会`https://hk.rule34.xxx//images/**`**
      - **图片上了反爬虫！！！**
      - `sample_url`和`file_url`其中有一个是指向图片的
      - 好像发现了`/detail/:id`中爬到的原始url，把**顶级域名去了**就可以一直获取
        - 不行，但好像又发现**可能需要改变header参数，如`referen`** -->

- 觉得viewer应该改成pixiv那样的，就能比较好显示tag
- 然后再加个view-imgDetail
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
   2. 从`/imgLisg/:tags/:page`到`/imgDetail/:tags/:id`，默认显示`:id`item，左右滑动以`:tags`dataList上下切换，回退直接到`/imgLisg/:tags/:page`，**这里滑动不记录router**，这里需要reducer记录下来`:tags`的dataList
      - [x]基本功能
      - 需要提前把`:tags`的dataList记录到reducer中，detail页读取到某个节点，开始请求上/下一页的`:tags`的dataList
5. view-collections
   1. [x]重构tags显示
   2. [x]增加img-likes显示
   3. 增加tags新数量提醒
      1. 本地浏览最新的记录
      2. 请求根据差数显示在tags的chip里
6. view-viewer
   1. tag-container
   2. 高级tag功能
7. view-setting
   1. 设置开启高级tag功能

## 1.0 基本功能
1. [x]tag、img收藏
2. [x]搜索tag
3. 显示详情的img，以及他的附带信息
4. [x]本地存储

## 1.0+ 功能
1. 搜索历史列表
2. 接入其他接口或者服务端渲染页面的高级功能
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

## 功能性bug
由于用的search-text reducer，只能存在一个gallery页，从detail的tag到gallery无法返回到之前的detail