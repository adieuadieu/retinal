const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src',
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: __dirname,
        exclude: /node_modules/,
      },
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: '.webpack',
    filename: 'handler.js', // this should match the first part of function handler in serverless.yml
  },
  externals: [nodeExternals()], // exclude external modules
  //externals: ['sharp'],
  plugins: [
    //new CopyWebpackPlugin([{ from: 'lib/sharp', to: 'node_modules/sharp' }]), // copy the sharp and libvips pre-compiled for lambda execution environment
  ],
}
