# rules wiki
定义一些规则

> 或许使用xml语法比json好多了

## 特殊标记符
### $
默认`$`符号都是json数据集合
### @js:
回调函数，`$`内包含了item的数据
### @qpath:
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
### @xpath:
xpath语法，用来选取xml元素
### 附加p$:
如果`inherit`启用，且`url`也有启用，使用`@css:` 需要用`inherit`的item内容可以附加，exm:`@css:p$:$(.class).text`
### @map:
`@map{key1::value1||key2::value2}@`