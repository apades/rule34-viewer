# rules wiki
定义一些规则，目前e621和rule34手动没问题，缺一个程序内切换的入口

> 或许使用xml语法比json好多了
## 特殊标记符
### $
- [x] useable
- [x] done

默认`$`符号都是json数据集合
### @js:
- [x] useable
- [ ] done

回调函数，`$`内包含了item的数据

回调函数的参数有点复杂，因为要包括content页单独的爬虫数据，还要有外层list页的item数据
### @css:
- [ ] useable
- [ ] done

css query语法，用来选取xml元素

```js
// 选择单个的
$('q sting').method

// 选择全部匹配的
$$('q string').method
```

`method`有以下几种
- text
- atr(key)
### @xml:
- [ ] useable
- [ ] done


xpath语法，用来选取xml元素
### ~~附加p$~~:
如果`inherit`启用，且`url`也有启用，使用`@css:` 需要用`inherit`的item内容可以附加，exm:`@css:p$:$(.class).text`
### ~~@map~~:
`@map{key1::value1||key2::value2}@`

## 规则和特性
主要有以下几种页面
- list      以`搜索词条`或者`主页`为列表显示的页面
- content   从`list`进去的页面，包含的数据：
  - `list`中就包含了`content`的所有信息
  - `list`只提供id给`content`单独爬取信息
  - `list`和`content`单独信息相互通用
- search    这个单独接入相关页面的搜索相关接口，然后跳到
  - `搜索词条`的`list`
- home      rule34默认`空搜索词条`为`home`页面，后续需要单独为某些页面添加`{key:dataList[],key:dataList}`这样数据结构的组件
- likes     目前是以`list`页面结构为主
- 