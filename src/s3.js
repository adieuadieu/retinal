import AWS from 'aws-sdk'
import config from './config'

const defaultParams = (config.s3 && config.s3.params) || {}

export const sourceBucket = new AWS.S3({
  params: { Bucket: config.sourceBucket },
})

export const destinationBucket = new AWS.S3({
  params: { Bucket: config.destinationBucket },
})

export function get (params = {}, bucket = sourceBucket) {
  const s3Params = {
    ...params,
  }

  return bucket.getObject(s3Params).promise()
}

export function upload (data, params = {}, bucket = destinationBucket) {
  const s3Params = {
    ...defaultParams,
    ...params,
    Body: data,
  }

  return bucket.upload(s3Params).promise()
}

export function remove (objects, bucket = destinationBucket) {
  const s3Params = {
    Delete: {
      Objects: objects.map(object => ({ Key: object })),
    },
  }

  return bucket.deleteObjects(s3Params).promise()
}
