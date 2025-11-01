console.log("Cars project is running!");

import HtmlWebpackPlugin from 'html-webpack-plugin';
const path = require("path");

export default {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve('dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // your HTML template
    }),
  ],
  devServer: {
    static: './public',
    port: 8081,
    open: true,
  },
};

