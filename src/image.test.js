/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import test from 'ava'
import config from './config'
import event from '../event.json'
import processItem from './image'

const { outputs } = config

test('processItem()', async (t) => {
  const promise = processItem(event.Records[0])
  t.notThrows(promise)

  const result = await promise
  t.is(result.length, outputs.length, 'Number of objects uploaded to S3 should match the number of outputs defined in config')
})
