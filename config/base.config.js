import rule_rule34 from '../rules/rule34.json'
// config
const _config = {
  gallery: {
    rowNum: 2,
    pageNum: 20,
    request: {
      gallery: {
        url:
          'https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}&limit=${pageNum}&pid=${page}',
        img:
          'https://rule34xxx/thumbnails/${item.directory}/thumbnails_${item.image}',
      },
      detail: {
        url: '',
        img: 'https://rule34xxx/images/${item.directory}/${item.image}',
        tags: {
          key: '',
          callback: 'fn',
          reg: '',
        },
      },
    },
  },
  showDebugComponent: false,
  rule: rule_rule34,
}
export default _config
