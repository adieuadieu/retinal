import config from './config'
import { get, upload } from './s3'
import sharpify from './sharp'

export async function processItem ({ s3: { object: { key } } }) {
  const { Body: image } = await get({ Key: key })
  const streams = await sharpify(image, config)

  return Promise.all(
    streams.map(async (stream, index) => await upload(stream, { Key: `output-${index}.jpg` }))
  )
}

export default async function imageHandler ({ Records: records }, context, callback) {
  await Promise.all(records.forEach(processItem))

  callback(null, { ok: 'did stuff', records })
}
