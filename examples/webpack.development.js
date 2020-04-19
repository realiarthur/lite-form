const path = require('path')

module.exports = {
  mode: 'development',
  entry: './examples/index.js',
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, '/'),
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    watchContentBase: true,
    hot: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: /\.css$/i,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
          }
        ]
      }
    ]
  }
}
