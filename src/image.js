import config from './config'
import { get, upload } from './s3'
import sharpify from './sharp'
import { makeKey } from './utils'

const { outputs } = config

export async function processItem ({ s3: { object: { key } } }) {
console.log('processItem:9')
  const { Body: image, ContentType: type } = await get({ Key: key })
  const streams = await sharpify(image, config)
  const context = { key, type }

  return Promise.all(
    streams.map(async (stream, index) =>
      await upload(stream, { ...outputs[index].params, Key: makeKey(outputs[index].key, context) })
    )
  )
}

export async function imageHandler ({ Records: records }, context, callback) {
console.log('imageHanlder:21')
  await Promise.all(records.forEach(processItem))
console.log('imageHanlder:23')
  callback(null, { ok: 'did stuff', records })
}
