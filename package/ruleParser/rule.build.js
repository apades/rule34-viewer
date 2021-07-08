let path = require('path')
let presolve = (...args) => path.resolve(__dirname, ...args)
/**@type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: presolve('../rules/_kkkkdm.ts'),
  output: {
    filename: '_kkkkdm.js',
    path: presolve('./dist'),
    library: 'rule',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
    ],
  },
}
