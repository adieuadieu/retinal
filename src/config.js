const customConfig = require('../config')

const DEFAULT_CONFIG = {
  name: 'retinal',
  provider: {
    profile: undefined,
    stage: 'dev',
    region: undefined,
  },
  sourceBucket: undefined,
  sourcePrefix: undefined,
  destinationBucket: undefined,
  destinationPrefix: undefined,
  s3: {
    params: {
      Metadata: {
        generator: 'created by a Retinal lambda function',
      },
    },
  },
  all: [],
  outputs: [],
  metadata: {
    saveJson: false,
    rekognition: false,
    middleware: undefined,
  },
}

const config = Object.assign(DEFAULT_CONFIG, customConfig)

module.exports = config
module.exports.serverless = () => config
