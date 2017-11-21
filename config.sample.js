module.exports = {
  name: 'serverless-sharp-image',
  provider: {
    profile: 'serverless-admin',
    stage: 'dev',
    region: 'eu-west-1',
  },
  sourceBucket: 'marco-test-bucket',
  sourcePrefix: 'serverless-sharp-image/incoming',
  destinationBucket: 'marco-test-bucket',
  destinationPrefix: 'serverless-sharp-image/processed/',
  s3: {
    params: {
      Metadata: {
        generator: 'created by a serverless-sharp-image lambda function',
      },
    },
  },
  all: [['rotate'], ['toFormat', 'jpeg', { quality: 80 }]],
  outputs: [
    {
      key: '%(filename)s-200x200.jpg',
      params: {
        ACL: 'public-read',
      },
      operations: [['resize', 200, 200], ['max'], ['withoutEnlargement']],
    },
    {
      key: '%(filename)s-100x100.jpg',
      operations: [['resize', 100, 100], ['max'], ['withoutEnlargement']],
    },
  ],
  metadata: {
    saveJson: false,
    rekognition: false,
    middleware: undefined,
  },
}
