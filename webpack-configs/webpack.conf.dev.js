const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const Common = require('./webpack.conf.js');

module.exports = merge(Common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 1000,
    poll: 1000
  },
  // output: {
  //   chunkFilename: 'js/[name].chunk.js'
  // },
  devServer: {
    inline: true,
    hot: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new Webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        }
      },
      {
        // test: /\.(js)$/,
        test: /\.m?js$/,
        include: Path.resolve(__dirname, '../src'),
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env'],
            presets: [
              [
                "@babel/preset-env",
                {
                  "useBuiltIns": "usage"
                }
              ]
            ],
            plugins: [
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-class-properties"
            ]
          }
        }
      },
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader?sourceMap=true', 'sass-loader']
      }
    ]
  }
});