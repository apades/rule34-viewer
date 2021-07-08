let path = require('path')
let presolve = (...args) => path.resolve(__dirname, ...args)

let HelloWorldPlugin = require('./plugin/injectCode')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
/**@type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  entry: presolve('./index.ts'),
  output: {
    filename: 'bundle.js',
    path: presolve('./dist'),
    library: 'ruleParser',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [new HelloWorldPlugin({ options: true })],
}
