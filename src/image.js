import config from './config'
import { get, upload } from './s3'
import sharpify from './sharp'
import { MIME_TYPES, getMetadata } from './metadata'
import { makeKey, decodeS3EventKey } from './utils'

const { outputs, metadata } = config

export default async function processItem ({
  eventName,
  s3: { object: { key: undecodedKey } } = { object: { key: false } },
}) {
  const key = decodeS3EventKey(undecodedKey)
  console.log('Processing: ', key)

  if (eventName.split(':')[0] !== 'ObjectCreated') {
    throw new Error(
      `Event does not contain a valid type (e.g. ObjectCreated). Invoked by event name: ${eventName}`
    )
  }

  if (!key) {
    throw new Error(`Event does not contain a valid S3 Object Key. Invoked with key: ${key}`)
  }

  const { Body: image, ...s3Metadata } = await get({ Key: key })
  s3Metadata.Key = key

  const streams = await sharpify(image, config)
  const context = { key, type: s3Metadata.ContentType }

  return Promise.all(
    streams.map(async (stream, index) => {
      const imageObjectKey = makeKey(outputs[index].key, context)
      const imageMetadata = await getMetadata(stream, s3Metadata, outputs[index])

      if (imageMetadata) {
        return Promise.all([
          upload(stream, {
            ContentType: imageMetadata.contentType || MIME_TYPES[(await stream.metadata()).format],
            ...outputs[index].params,
            Key: imageObjectKey,
          }),
          metadata && metadata.saveJson
            ? upload(JSON.stringify(imageMetadata), {
              ContentType: 'application/json',
              Key: `${imageObjectKey}.json`,
            })
            : Promise.resolve(),
        ])
      }

      console.log(`Skipped uploading '${imageObjectKey}' to S3`)

      return []
    })
  )
}
