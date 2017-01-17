/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const targz = require('tar.gz')
const webpack = require('webpack')

function ExtractTarballPlugin (archive, to) {
  return {
    apply: (compiler) => {
      compiler.plugin('emit', (compilation, callback) => {
        targz().extract(path.resolve(archive), path.resolve(to), (error) => {
          if (error) {
            return console.error('Unable to extract archive ', archive, to, error.stack)
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
  externals: ['sharp', 'aws-sdk'],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: false, warnings: false }),
    new ExtractTarballPlugin('lib/sharp-0.17.1-linux-x64.tar.gz', '.webpack/'),
  ],
}
