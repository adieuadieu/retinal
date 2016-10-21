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

- next attempt:
 - unzip the sharp package
 - remove include and lib folders (could be handled by removing them before we zip, need to rezip anyway to make it not nested in a node_modules folder)
 - in code, maybe in sharp.js, check for include/lib folder in node_modules/sharp and if non, unzip the libvips tarball.
  - ? add a global into webpack which checks for broken symlink in lib folder to see if we're on a mac or linux, then disable the code depending on global?

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
