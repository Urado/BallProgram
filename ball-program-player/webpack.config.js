const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/renderer/index.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {extensions: ['.ts', '.tsx', '.js']},
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
  target: 'electron-renderer',
};