import AWS from 'aws-sdk'
import config from './config'
import { encodeS3Key } from './utils'

export const rekognition = new AWS.Rekognition()

// @TODO: check public-read, if not, upload image in params, if filesize is under 5mb.

export function detectFaces (params = {}, s3key, bucket = config.sourceBucket) {
  const rekognitionParams = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: encodeS3Key(s3key),
      },
    },
    ...params,
  }
  console.log('=================', rekognitionParams)
  return rekognition.detectFaces(rekognitionParams).promise()
}

export function detectLabels (
  { maxLabels = 0, minConfidence = 0.0 } = {},
  bucket = config.sourceBucket,
  s3key
) {
  const rekognitionParams = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: encodeS3Key(s3key),
      },
    },
    MaxLabels: maxLabels,
    MinConfidence: minConfidence,
  }

  return rekognition.detectLabels(rekognitionParams).promise()
}

export function detectModerationLabels (
  { minConfidence = 0.0 } = {},
  s3key,
  bucket = config.sourceBucket
) {
  const rekognitionParams = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: encodeS3Key(s3key),
      },
    },
    MinConfidence: minConfidence,
  }

  return rekognition.detectModerationLabels(rekognitionParams).promise()
}

export function indexFaces (
  { collectionId, detectionAttributes, externalImageId } = {},
  s3key,
  bucket = config.sourceBucket
) {
  const rekognitionParams = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: encodeS3Key(s3key),
      },
    },
    CollectionId: collectionId,
    DetectionAttributes: detectionAttributes,
    ExternalImageId: externalImageId,
  }

  return rekognition.indexFaces(rekognitionParams).promise()
}

export async function recognizeCelebrities (params = {}, s3key, bucket = config.sourceBucket) {
  const rekognitionParams = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: encodeS3Key(s3key),
      },
    },
    ...params,
  }

  return rekognition.recognizeCelebrities(rekognitionParams).promise()
}
