const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(Path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: Path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: true,
    })
  })
}

const htmlPlugins = generateHtmlPlugins(Path.resolve(__dirname, '../src/html/views'));

module.exports = {
  entry: {
    app: ['@babel/polyfill', Path.resolve(__dirname, '../src/scripts/index.js')]
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  plugins: [
    new CleanWebpackPlugin(['build'], { root: Path.resolve(__dirname, '..') }),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: './' }
    ])
  ].concat(htmlPlugins),
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        include: Path.resolve(__dirname, '../src/html/includes'),
        use: ['raw-loader']
      },
      {
        test: /\.mjs$/,
        include: /(node_modules|bower_components)/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
    ]
  },
  devServer: {
    port: 9000,
    contentBase: Path.join(__dirname, '../build'),
    watchContentBase: true,
  },
};