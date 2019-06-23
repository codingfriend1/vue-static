const path = require("path");
const bootFolder = path.resolve(__dirname, "the-magic", "boot")
const config = require("./site.config");

const folders = {
  node_modules: path.resolve(__dirname, "node_modules"),
  the_magic: path.resolve(__dirname, 'the-magic'),
  boot: bootFolder,
  published_html_path: path.resolve(bootFolder, "_index.html"),
  css_folder: path.resolve(__dirname, config.folderStructure.css),
  components_folder: path.resolve(__dirname, config.folderStructure.components),
  partials_folder: path.resolve(__dirname, config.folderStructure.partials),
  static_folder: path.resolve(__dirname, config.folderStructure.static),
  html_template: path.resolve(__dirname, config.folderStructure.html),
  output_folder: path.resolve(__dirname, config.folderStructure.output),
};

require("colors");
const webpack = require("webpack");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AsyncAwaitPlugin = require("webpack-async-await");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const configs = [];

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const node = /node_modules/;

const base = {
  stats: "errors-only",
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: node
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: node,
        include: [folders.components_folder, folders.partials_folder],
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              fallback: "vue-style-loader",
              use: "css-loader"
            }),
            styl: ExtractTextPlugin.extract({
              fallback: "vue-style-loader",
              use: "css-loader!stylus-loader"
            }),
            stylus: ExtractTextPlugin.extract({
              fallback: "vue-style-loader",
              use: "css-loader!stylus-loader"
            }),
            html: "pug-loader"
          }
        }
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract({
          use: "css-loader!sass-loader"
        }),
        include: [folders.css_folder, folders.components_folder, folders.partials_folder]
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          use: "css-loader!stylus-loader"
        }),
        exclude: node,
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

  // Dev plugins

  plugins: [
    new webpack.DefinePlugin({
      main_js: JSON.stringify(path.resolve(__dirname, config.folderStructure.js)),
      main_css: JSON.stringify(path.resolve(__dirname, config.folderStructure.css)), 
      main_vue: JSON.stringify(path.resolve(__dirname, config.folderStructure.vue))
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new AsyncAwaitPlugin({
      awaitAnywhere: true,
      asyncExits: true
    }),
    new ExtractTextPlugin({
      filename: "production.css"
    }),
    new ProgressBarPlugin({
      format: " [:bar] " + ":percent".bold + " (:msg)"
    }),
    new FriendlyErrorsPlugin({
      clearConsole: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(folders.static_folder, "/**/*"),
        context: folders.static_folder,
        to: folders.output_folder
      }
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })

    // Production plugins
  ].concat(
    isProduction
      ? [
          new OptimizeCSSPlugin({
            cssProcessorOptions: {
              safe: true
            }
          }),
          new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js|css)$/,
            threshold: 10240,
            minRatio: 0.8
          })
        ]
      : []
  ),
  performance: {
    hints: false
  },
  resolve: {
    alias: {
      config: path.join(__dirname, "site.config.js"),
      src: path.join(__dirname, "src"),
      static: path.join(__dirname, "src", "static"),
      templates: path.join(__dirname, "src", "templates"),
    }
  }
};

configs[0] = merge({}, base, {
  entry: folders.boot,
  output: {
    path: folders.output_folder,
    publicPath: "/",
    filename: "production.js",
    chunkFilename: "[id].js",
    sourceMapFilename: "[file].map"
  },
  externals: isTest ? nodeExternals() : undefined,
  devtool: isProduction
    ? false
    : isTest
      ? "inline-cheap-module-source-map"
      : "cheap-module-eval-source-map",
  resolve: {
    modules: ["node_modules"],
    mainFields: ["browser", "main"],
    alias: {
      vue: "vue/dist/vue.js",
      config: path.join(__dirname, "site.config.js"),
      theme: folders.components_folder
    }
  },
  plugins: base.plugins
    .concat([
      new VueSSRClientPlugin(),
      new HtmlWebpackPlugin({
        filename: folders.published_html_path,
        minify: {
          removeAttributeQuotes: false,
          removeComments: false,
          collapseWhitespace: true,
          removeScriptTypeAttributes: true
        },
        template: folders.html_template,
        inject: false
      }),
    ])
    .concat(
      !isProduction
        ? []
        : []
        // [
        //     new webpack.optimize.CommonsChunkPlugin({
        //       name: "manifest",
        //       chunks: ["vendor"]
        //     }),
        //     new webpack.optimize.CommonsChunkPlugin({
        //       name: "vendor",
        //       minChunks: function(module, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //           module.resource &&
        //           /\.js$/.test(module.resource) &&
        //           module.resource.indexOf(
        //             path.join(__dirname, "node_modules")
        //           ) === 0
        //         );
        //       }
        //     })
        //   ]
    )
});

configs[1] = merge({}, base, {
  target: "node",
  entry: {
    app: path.resolve(folders.boot, "entry-server.js")
  },
  externals: nodeExternals({
    whitelist: /(\.css$|\.less$|\.sass$|\.scss$|\.styl$|\.stylus$|\.(png|jpe?g|gif|svg)(\?.*)?$|\.(woff2?|eot|ttf|otf)(\?.*)?$)/
  }),
  output: {
    libraryTarget: "commonjs2",
    path: folders.output_folder,
    filename: "[name].js"
  },
  devtool: isProduction
    ? false
    : isTest
      ? "inline-cheap-module-source-map"
      : "cheap-source-map",
  plugins: base.plugins.concat([new VueSSRServerPlugin()])
});

module.exports = isTest ? configs[0] : configs;
