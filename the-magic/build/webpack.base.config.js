require('colors')
const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ProgressBarPlugin = require("progress-bar-webpack-plugin")
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const { VueLoaderPlugin } = require('vue-loader')
const folders = require('./folders.js')
const NODE_ENV = process.env.NODE_ENV || 'development'
const isProd = NODE_ENV === 'production'

module.exports = {
  stats: "errors-only",
  mode: NODE_ENV,
  devtool: isProd
    ? '#source-map'
    : '#cheap-module-source-map',
  output: {
    path: folders.output_folder,
    publicPath: "/",
    filename: "production.js",
    sourceMapFilename: "[file].map"
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm.js",
      config: folders.config_path,
      src: folders.src,
      static: folders.static_folder,
      templates: folders.components_folder,
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: folders.node_modules,
        include: [folders.components_folder, folders.partials_folder],
        options: {
          optimizeSSR: false,
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.pug$/,
        oneOf: [
          // this applies to `<template lang="pug">` in Vue components
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          // this applies to pug imports inside JavaScript
          {
            use: ['raw-loader', 'pug-plain-loader']
          }
        ],
        exclude: folders.node_modules,
        include: [folders.components_folder, folders.partials_folder],
      },
      {
        test: /\.css$/,
        use: [
          !isProd ? 'vue-style-loader': MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          !isProd ? 'vue-style-loader': MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
        include: [folders.css_path, folders.components_folder, folders.partials_folder]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          !isProd ? 'vue-style-loader': MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ],
        exclude: folders.node_modules,
        include: [folders.css_path, folders.components_folder, folders.partials_folder]
      },
      {
        test: /\.svg$/,
        loader: "raw-loader"
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "img/[name].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "fonts/[name].[ext]"
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: [
    new webpack.DefinePlugin({
      main_js: JSON.stringify(folders.js_path),
      main_css: JSON.stringify(folders.css_path), 
      main_vue: JSON.stringify(folders.vue_path),

      // strip dev-only code in Vue source
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new MiniCssExtractPlugin({
      filename: "production.css"
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(folders.static_folder, "/**/*"),
        context: folders.static_folder,
        to: folders.output_folder
      }
    ]),
    new VueLoaderPlugin(),
    new FriendlyErrorsPlugin({
      clearConsole: true
    }),
    ...isProd ? [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|css)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
    ] : [
      new ProgressBarPlugin({
        format: " [:bar] " + ":percent".bold + " (:msg)"
      }),
    ]
  ]
}
