const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const { VueLoaderPlugin } = require('vue-loader')
const config = require('../site.config')
const folders = require('./folders.js')

const NODE_ENV = process.env.NODE_ENV || 'development'
const isProd = NODE_ENV === 'production'

module.exports = {
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
      config: path.join(__dirname, "..", "site.config.js"),
      src: path.join(__dirname, "..", "src"),
      static: path.join(__dirname, "..", "src", "static"),
      templates: path.join(__dirname, "..", "src", "templates"),
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: "babel-loader",
      //   exclude: folders.node_modules
      // },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: folders.node_modules,
        include: [folders.components_folder, folders.partials_folder],
        options: {
          optimizeSSR: false,
          compilerOptions: {
            preserveWhitespace: false
          },
          loaders: {
            html: "pug-loader",
          }
          // loaders: {
          //   css: ExtractTextPlugin.extract({
          //     fallback: "vue-style-loader",
          //     use: "css-loader"
          //   }),
          //   styl: ExtractTextPlugin.extract({
          //     fallback: "vue-style-loader",
          //     use: "css-loader!stylus-loader"
          //   }),
          //   stylus: ExtractTextPlugin.extract({
          //     fallback: "vue-style-loader",
          //     use: "css-loader!stylus-loader"
          //   }),
          //   html: "pug-loader"
          // }
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
        include: [folders.css_folder, folders.components_folder, folders.partials_folder]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          !isProd ? 'vue-style-loader': MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ],
        // loader: ExtractTextPlugin.extract({
        //   use: "css-loader!stylus-loader"
        // }),
        exclude: folders.node_modules,
        include: [folders.css_folder, folders.components_folder, folders.partials_folder]
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
      main_js: JSON.stringify(path.resolve(__dirname, "..", config.folderStructure.js)),
      main_css: JSON.stringify(path.resolve(__dirname, "..", config.folderStructure.css)), 
      main_vue: JSON.stringify(path.resolve(__dirname, "..", config.folderStructure.vue))
    }),
    // new ExtractTextPlugin({
    //   filename: "production.css"
    // }),
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
    ... isProd ? [
      // new CompressionWebpackPlugin({
      //   asset: "[path].gz[query]",
      //   algorithm: "gzip",
      //   test: /\.(js|css)$/,
      //   threshold: 10240,
      //   minRatio: 0.8
      // })
    ] : [ new FriendlyErrorsPlugin() ]
  ]
}
