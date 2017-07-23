import config from './config'
import { get, upload } from './s3'
import sharpify from './sharp'
import { makeKey, decodeS3EventKey } from './utils'

const { outputs } = config

const imageMimeTypes = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
}

export default (async function processItem ({
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

  const { Body: image, ContentType: type } = await get({ Key: key })
  const streams = await sharpify(image, config)
  const context = { key, type }

  return Promise.all(
    streams.map(async (stream, index) =>
      upload(stream, {
        ContentType: imageMimeTypes[(await stream.metadata()).format],
        ...outputs[index].params,
        Key: makeKey(outputs[index].key, context),
      })
    )
  )
})
