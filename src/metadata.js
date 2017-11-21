import exifReader from 'exif-reader'
import config from './config'
import * as rekognitionFunctions from './rekognition'

const { metadata: { saveJson, rekognition, middleware } } = config

export const MIME_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  json: 'application/json',
}

export async function getMetadata (sharpStream, s3MetaData = {}, outputConfig) {
  let data = await sharpStream.metadata()
  data.contentType = MIME_TYPES[data.format]
  data.s3 = s3MetaData

  if (saveJson || middleware) {
    data.exifBuffer = data.exif
    data.exif = exifReader(data.exifBuffer)
  }

  if (rekognition) {
    const keys = Object.keys(rekognition)
    const results = await Promise.all(
      keys.map(method =>
        rekognitionFunctions[method](
          typeof rekognition[method] === 'object' ? rekognition[method] : {},
          s3MetaData.Key
        )
      )
    )

    data.rekognition = results.reduce(
      (reduced, item, index) => ({ ...reduced, [keys[index]]: item }),
      {}
    )
  }

  if (middleware) {
    data = await middleware(data, outputConfig)
  }

  return data
}

export async function processItem () {
  // @ TODO
}
