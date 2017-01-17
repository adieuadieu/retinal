import AWS from 'aws-sdk'
import config from './config'

const defaultParams = (config.s3 && config.s3.params) || {}

const sourceBucket = new AWS.S3({
  params: { Bucket: config.sourceBucket },
})

const destinationBucket = new AWS.S3({
  params: { Bucket: config.destinationBucket },
})

export function get (params = {}) {
  const s3Params = {
    ...params,
  }

  return sourceBucket.getObject(s3Params).promise()
}

export function upload (data, params = {}) {
  const s3Params = {
    ...defaultParams,
    ...params,
    Body: data,
  }

  return new Promise((resolve, reject) => {
    destinationBucket.upload(s3Params, (error, response) => {
      if (error) {
        return reject(error)
      }

      return resolve(response)
    })
  })
}

export function remove (objects) {
  const s3Params = {
    Delete: {
      Objects: objects.map(object => ({ Key: object })),
    },
  }

  return destinationBucket.deleteObjects(s3Params).promise()
}
