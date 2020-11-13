# lib
## ui
[react-native-paper](https://callstack.github.io/react-native-paper/index.html)

## router
[React Navigation](https://reactnavigation.org/)

## viewer
[react-native-image-viewer](https://github.com/ascoders/react-native-image-viewer)

## grid-view
[gridView](https://www.npmjs.com/package/react-native-super-grid)

# api
## 遇到的问题

- `sample_url`和`file_url`指向不同的url
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
        - 不行，但好像又发现**可能需要改变header参数，如`referen`**

# 功能

1. tags
   1. [x]收藏
   2. 新数量提醒
2. item
   1. [x]收藏
   2. 收藏分类
3. 收藏本地存储化
4. 搜索
   1. 历史列表
   2. header优化
5. img浏览
   1. 接入gallery点击
   2. 从`/imgLisg/:tags/:page`到`/imgDetail/:tags/:id`，默认显示`:id`item，左右滑动以`:tags`dataList上下切换，回退直接到`/imgLisg/:tags/:page`，**这里滑动不记录router**，这里需要reducer记录下来`:tags`的dataList
      - 需要提前把`:tags`的dataList记录到reducer中，detail页读取到某个节点，开始请求上/下一页的`:tags`的dataList

# 发现的bug
## <del>多次刷新</del>
```js
getLike: (id) => state.likes.imgs[id],
```
这个导致了重新把列表刷新了一遍

## <del>gallery搜索切换</del>
从gallery搜索的tag进去新的gallery，在进去这个新tag的viewer后，返回旧的gallery的viewer会报错

## 搜索bug
使用搜索进入新的gallery会**叠加一次**gallery的loadData，从collect进去就没问题

## fristLoad bug
应该更`搜索bug`相关联，现在他也一直卡住加载中状态
问题出在了`navigation.replace('home', { redirect: 'gallery' })`地方