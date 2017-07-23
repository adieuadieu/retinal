import exifReader from 'exif-reader'

import config from './config'

const { metadata: { saveJson, rekognition, middleware } } = config

export const MIME_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  json: 'application/json',
}

export async function getMetadata (sharpStream, s3MetaData = {}) {
  let data = await sharpStream.metadata()
  data.contentType = MIME_TYPES[data.format]
  data.s3 = s3MetaData

  if (saveJson || middleware) {
    data.exifBuffer = data.exif
    data.exif = exifReader(data.exifBuffer)
  }

  if (rekognition) {
    // @TODO
    data.rekognition = {}
  }

  if (middleware) {
    data = await middleware(data)
  }

  return data
}

export async function processItem () {
  // @ TODO
}
