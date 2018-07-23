require("colors");
const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AsyncAwaitPlugin = require("webpack-async-await");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
const configs = [];
const config = require("./site.config");

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const node = /node_modules/;

const folders = {
  root: path.resolve(__dirname),
  node_modules: path.resolve(__dirname, "node_modules"),
  boot: path.resolve(__dirname, "themes", config.theme),

  theme_folder: path.join(__dirname, "themes", config.theme),
  theme_static_folder: path.join(__dirname, "themes", config.theme, "static"),
  static_folder: path.join(__dirname, "static"),
  html_template: path.join(
    __dirname,
    "themes",
    config.theme,
    "index.template.html"
  ),
  published_html_path: path.join(
    __dirname,
    "themes",
    config.theme,
    "_index.html"
  ),
  output_folder: path.join(__dirname, "dist"),
  templates_folder: path.join(__dirname, "templates"),
  theMagic: path.resolve(__dirname, 'the-magic')
};


const base = {
  stats: "errors-only",
  module: {
    loaders: [
      // {
      //   test: /\.pug/,
      //   loaders: ["string-loader", "pug-html-loader"],
      //   exclude: node,
      //   include: [folders.theme_folder, folders.templates_folder]
      // },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: node
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: node,
        include: [folders.theme_folder, folders.templates_folder],
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
        include: [folders.theme_folder, folders.templates_folder]
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          use: "css-loader!stylus-loader"
        }),
        exclude: node,
        include: [folders.theme_folder, folders.templates_folder]
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
    new webpack.NoEmitOnErrorsPlugin(),
    new AsyncAwaitPlugin({
      awaitAnywhere: true,
      asyncExits: true
    }),
    new ExtractTextPlugin({
      filename: "[name].css"
    }),
    new ProgressBarPlugin({
      format: " [:bar] " + ":percent".bold + " (:msg)"
    }),
    new FriendlyErrorsPlugin({
      clearConsole: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(folders.theme_static_folder, "/**/*"),
        context: folders.theme_static_folder,
        to: folders.output_folder
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.join(folders.static_folder, "/**/*"),
        context: folders.static_folder,
        to: folders.output_folder
      }
    ]),
    // new ImageminPlugin({
    //   disable: process.env.NODE_ENV !== 'production',
    //   test: /\.(jpe?g|png|gif|svg)$/i,
    //   pngquant: {
    //     quality: '80-90'
    //   },
    //   plugins: [
    //     imageminMozjpeg({
    //       quality: 80,
    //       progressive: true
    //     })
    //   ]
    // }),
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
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            minimize: true,
            compress: {
              warnings: false
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
      templates: path.resolve(__dirname, "templates"),
      theme: folders.theme_folder
    }
  }
};

configs[0] = merge({}, base, {
  entry: folders.boot,
  output: {
    path: folders.output_folder,
    publicPath: "/",
    filename: "[name].js",
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
      templates: path.resolve(__dirname, "templates"),
      theme: folders.theme_folder
    }
  },
  plugins: base.plugins
    .concat([
      // new WebpackCleanupPlugin({
      //   exclude: [
      //     "index.html",
      //     "file-size-report.html",
      //     "vue-ssr-server-bundle.json",
      //     "favicon.ico",
      //     "images/**/*",
      //     "fonts/**/*"
      //   ],
      // }),
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
        inject: true
      }),
      // new BundleAnalyzerPlugin({
      //   reportFilename: 'file-size-report.html'
      // })
    ])
    .concat(
      !isProduction
        ? []
        : [
            new webpack.optimize.CommonsChunkPlugin({
              name: "manifest",
              chunks: ["vendor"]
            }),
            new webpack.optimize.CommonsChunkPlugin({
              name: "vendor",
              minChunks: function(module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                  module.resource &&
                  /\.js$/.test(module.resource) &&
                  module.resource.indexOf(
                    path.join(__dirname, "node_modules")
                  ) === 0
                );
              }
            })
          ]
    )
});

configs[1] = merge({}, base, {
  target: "node",
  entry: {
    app: path.resolve(folders.theMagic, "server-entry.js")
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
