import test from 'ava'
import config from './config'
import { get, upload, remove } from './s3'

const {
  sourceBucket,
  sourcePrefix = '',
  destinationBucket,
  destinationPrefix = '',
  outputs,
  metadata,
} = config.serverless()

test('source bucket should be configured', (t) => {
  t.truthy(sourceBucket)
  t.not(sourceBucket.length, 0)
})

test('destination bucket should be configured', (t) => {
  t.truthy(destinationBucket)
  t.not(destinationBucket.length, 0)
})

test('there should be at least 1 output defined in the "outputs" array', (t) => {
  t.truthy(outputs)
  t.truthy(outputs instanceof Array)
  t.not(outputs.length, 0)
})

test('each output must have at least 1 operation defined in each outputs "operations" array', (t) => {
  outputs.forEach(({ operations }) => {
    t.truthy(operations)
    t.truthy(operations instanceof Array)
    t.not(operations.length, 0)
  })
})

test('each output must have an S3 object key defined', (t) => {
  outputs.forEach(({ key }) => {
    t.truthy(key)
    t.is(typeof key, 'string')
    t.not(key.length, 0)
  })
})

test('should be able to read from the configured S3 source bucket', async (t) => {
  const key = [
    sourcePrefix,
    'totally-fake-made-up-test-key-that-most-likely-does-not-exist.test',
  ].join('/')
  const promise = get({ Key: key })

  const result = await t.throws(promise, 'The specified key does not exist.')

  t.is(result.code, 'NoSuchKey')
})

test('should be able to write to the configured S3 destination bucket', async (t) => {
  const key = [
    destinationPrefix,
    'totally-fake-made-up-test-key-that-most-likely-does-not-exist.test',
  ].join('')
  const promise = upload('test', { Key: key })

  await t.notThrows(promise)

  await remove([key])
})

test('metadata configuration should be valid', async (t) => {
  t.truthy(['boolean', 'object'].includes(typeof metadata), 'metadata should be false or an object')

  if (metadata) {
    const { saveJson, rekognition, middleware } = metadata
    t.truthy(['undefined', 'boolean'].includes(typeof saveJson))
    t.truthy(['undefined', 'boolean', 'object'].includes(typeof rekognition))
    t.truthy(['undefined', 'function'].includes(typeof middleware))

    if (middleware) {
      const promise = middleware()
      t.truthy(promise instanceof Promise)
      await t.notThrows(promise)
    }

    if (rekognition) {
      t.is(typeof rekognition, 'object')

      t.truthy(
        saveJson || middleware,
        'no point enabling rekognition when no middleware or saveJson is set'
      )
    }
  }
})
