import AWS from 'aws-sdk'
import config from './config'

const defaultParams = (config.s3 && config.s3.params) || {}

const sourceBucket = new AWS.S3({
  params: { Bucket: config.sourceBucket },
})

const destinationBucket = new AWS.S3({
  params: { Bucket: config.destinationBucket },
})

export async function get (params = {}) {
  const s3Params = {
    ...params,
  }

  return await sourceBucket.getObject(s3Params).promise()
}

export async function upload (data, params = {}) {
  const s3Params = {
    ...defaultParams,
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

export async function remove (objects) {
  const s3Params = {
    Delete: {
      Objects: objects.map(object => ({ Key: object })),
    },
  }

  return await destinationBucket.deleteObjects(s3Params).promise()
}
