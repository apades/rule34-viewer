let axios = require('axios')

const url = `http://m.kkkkdm.com/comiclist/2044/`

let request = axios.create({
  headers: {
    'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36`,
    'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8',
  },
})

request.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('axios error'.red)
  },
)
;(async () => {
  let res = await request(url, {
    responseType: 'arraybuffer',
  })
  let rs = new TextDecoder('GBK').decode(res.data)
  console.log(rs)
})()
