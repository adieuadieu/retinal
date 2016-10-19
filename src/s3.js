import AWS from 'aws-sdk'
import config from './config'

const sourceBucket = new AWS.S3({ params: { Bucket: config.sourceBucket, Prefix: config.sourceBucketPrefix } })
const destinationBucket = new AWS.S3({ params: { Bucket: config.destinationBucket, Prefix: config.destinationBucketPrefix } })

export async function getObject (params) {
  const s3Params = {
    ...params,
  }

  return await new Promise((resolve, reject) => {
    sourceBucket.upload(s3Params, (error, response) => {
      if (error) {
        return reject(error)
      }

      return resolve(response)
    })
  })
}

export async function putObject (data, params) {
  const s3Params = {
    ...params,
    Body: data,
  }

  return await new Promise((resolve, reject) => {
    destinationBucket.upload(s3Params, (error, response) => {
      if (error) {
        return reject(error)
      }

      return resolve(response)
    })
  })
}

export async function deleteObjects (objects) {
  const s3Params = {
    Delete: {
      Objects: objects.map(object => ({ Key: object })),
    },
  }

  return await new Promise((resolve, reject) => {
    destinationBucket.deleteObjects(s3Params, (error, response) => {
      if (error) {
        return reject(error)
      }

      return resolve(response)
    })
  })
}
