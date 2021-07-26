const { default: Axios } = require('axios')
let HttpsProxyAgent = require('https-proxy-agent')
let { createWriteStream } = require('fs')
const writer = createWriteStream('test.png')
Axios.get(
  'https://rule34.xxx/images/3679/75f4065265c7335e926c902316ed0442126a0346.png?241',
  {
    responseType: 'stream',
    httpsAgent: new HttpsProxyAgent('http://localhost:10809'),
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua':
        '"Chromium";v="86", "\\"Not\\\\A;Brand";v="99", "Google Chrome";v="86"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'upgrade-insecure-requests': '1',
      cookie: '__cfduid=df6aa3499c39bec0601b4fb816cf7cd851603684430',
    },
  },
).then((response) => {
  //ensure that the user can call `then()` only when the file has
  //been downloaded entirely.

  return new Promise((resolve, reject) => {
    response.data.pipe(writer)
    let error = null
    writer.on('error', (err) => {
      error = err
      writer.close()
      console.error('error', err)
      reject(err)
    })
    writer.on('close', () => {
      if (!error) {
        resolve(true)
      }
      console.log('resolve')
    })
  })
})
