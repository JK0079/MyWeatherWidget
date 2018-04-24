const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             },
             {
                  test: /\.css$/,
                  use: ['style-loader', 'css-loader']
                },
              {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
              }
         ]

  },

  plugins: [
    new HtmlWebpackPlugin({template: './src/public/index.html'}),
    new ExtractTextPlugin({ 
      filename: 'dist/[name].bundle.css',
      allChunks: true,
    }),
  ],
  devServer: {  // configuration for webpack-dev-server
      contentBase: './src',  //source of static assets
      port: 7700, // port to run dev-server
  },
  entry: './src/app/weather.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'MyWeatherWidget.bundle.js'
  }
}
