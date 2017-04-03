import fs from 'fs'
import path from 'path'
import test from 'ava'
import config from './config'
import processItem from './image'
import { sourceBucket, destinationBucket, upload, remove } from './s3'

const { sourcePrefix, outputs } = config

const testImage = path.join(__dirname, 'test image.jpg')
const testImageStream = fs.createReadStream(testImage)
const testKey = [sourcePrefix, 'test image ütf テスト.jpg'].join('')

const event = {
  Records: [
    {
      s3: {
        object: {
          key: testKey,
        },
      },
      eventName: 'ObjectCreated:Put',
    },
  ],
}

test.before(() => upload(testImageStream, { Key: testKey }, sourceBucket))

test.after.always(() => remove([testKey], sourceBucket))

test('processItem()', async (t) => {
  await t.throws(
    processItem({ ...event.Records[0], eventName: 'fake-event' }),
    Error,
    'It should throw an Error when not provided with a valid eventName',
  )

  await t.throws(
    processItem({ eventName: 'ObjectCreated' }),
    Error,
    'It should throw error when S3 object key is missing.',
  )

  const promise = processItem(event.Records[0])
  t.notThrows(promise)

  const result = await promise

  t.is(
    result.length,
    outputs.length,
    'Number of objects uploaded to S3 should match the number of outputs defined in config.',
  )

  // Teardown. Remove the resized images from the S3 bucket.
  await remove(result.map(({ Key }) => Key), destinationBucket)
})
