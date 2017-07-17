import customConfig from '../config'

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
}

export default { ...DEFAULT_CONFIG, ...customConfig }
