import test from 'ava'
import AWS from 'aws-sdk'
import config from './config'
import { get, upload, remove } from './s3'

const {
  sourceBucket,
  sourcePrefix = '',
  destinationBucket,
  destinationPrefix = '',
  outputs,
} = config

test('AWS profile should have sufficient permissions for deploy(initial)', async (t) => {
  const iam = new AWS.IAM({ apiVersion: '2010-05-08' })
  const currentAwsUser = await iam.getUser({}).promise().then(done => done)
  const params = {
    PolicySourceArn: currentAwsUser.User.Arn,
    ActionNames: ['arn:aws:iam::aws:policy/AmazonS3FullAccess'],
  }
  const policyDryRun = await iam.simulatePrincipalPolicy(params).promise().then(data => data)
  t.is(policyDryRun.EvaluationResults[0].EvalDecision, 'allowed')
})

test('source bucket should be configured(initial)', (t) => {
  t.truthy(sourceBucket)
  t.not(sourceBucket.length, 0)
})

test('destination bucket should be configured', (t) => {
  t.truthy(destinationBucket)
  t.not(destinationBucket.length, 0)
})

test('there should be at least 1 output defined in the "outputs" array(initial)', (t) => {
  t.truthy(outputs)
  t.truthy(outputs instanceof Array)
  t.not(outputs.length, 0)
})

test('each output must have at least 1 operation defined in each outputs "operations" array(initial)', (t) => {
  outputs.forEach(({ operations }) => {
    t.truthy(operations)
    t.truthy(operations instanceof Array)
    t.not(operations.length, 0)
  })
})

test('each output must have an S3 object key defined(initial)', (t) => {
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
