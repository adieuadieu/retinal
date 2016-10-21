const rimraf = require('rimraf')
const targz = require('tar.gz')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

function SpecialPoop (archive, to) {
  return {
    apply: (compiler) => {
      compiler.plugin('emit', (compilation, callback) => {
        targz().extract(archive, to, (error) => {
          if (error) {
            return console.error('Unable to extract archive ', error.stack)
          }

          return callback()
        })
      })
    },
  }
}

module.exports = {
  entry: './src/handler',
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
  //externals: [nodeExternals()], // exclude external modules
  externals: ['sharp', 'aws-sdk'],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: false, warnings: false }),
    //new CopyWebpackPlugin([{ from: 'lib/sharp', to: './node_modules/sharp' }]), // copy the sharp and libvips pre-compiled for lambda execution environment
    new SpecialPoop('lib/sharp-0.16.1-linux-x64.tar.gz', '.webpack/'),
  ],
}
