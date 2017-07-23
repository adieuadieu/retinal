import processItem from './image'

// eslint-disable-next-line import/prefer-default-export
export async function processImage ({ Records: records }, context, callback) {
  try {
    await Promise.all(records.map(processItem))
  } catch (error) {
    console.error(error)
    return callback(error, { records })
  }

  console.log(`Completed processing ${records.length} event${records.length === 1 ? '' : 's'}`)

  return callback(null)
}

export async function processItemMetadata ({ Records: records }, context, callback) {
  try {
    await Promise.all(records.map(processItem))

    /*
    let middlewareResult = true

    if (metadata.rekognition) {
      // @TODO
      imageMetadata.rekognition = {}
    }

    if (metadata.middleware) {
      middlewareResult = metadata.middleware(imageMetadata)
    }

    if (middlewareResult) {

      if (metadata.saveJson) {
        await upload(middlewareResult, {
          ContentType: 'application/json',
          Key: `${imageObjectKey}.json`,
        })
      }
    }
*/
  } catch (error) {
    console.error(error)
    return callback(error, { records })
  }

  console.log(`Completed processing ${records.length} event${records.length === 1 ? '' : 's'}`)

  return callback(null)
}
