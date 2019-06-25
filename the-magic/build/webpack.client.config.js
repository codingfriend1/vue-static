const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const site_config = require("../../site.config")
const folders = require('./folders.js')

const config = merge(base, {
  entry: {
    app: path.resolve(folders.boot, 'index.js')
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js'
    }
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]
})

// if (process.env.NODE_ENV === 'production') {
//   config.plugins.push(
//     // auto generate service worker
//     new SWPrecachePlugin({
//       cacheId: 'vue-hn',
//       filename: 'service-worker.js',
//       minify: true,
//       dontCacheBustUrlsMatching: /./,
//       staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
//       runtimeCaching: [
//         {
//           urlPattern: '/',
//           handler: 'networkFirst'
//         },
//         {
//           urlPattern: /\/(top|new|show|ask|jobs)/,
//           handler: 'networkFirst'
//         },
//       ]
//     })
//   )
// }

module.exports = config