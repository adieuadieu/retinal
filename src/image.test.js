import test from 'ava'
import config from './config'
import event from '../event.json'
import processItem from './image'

const { outputs } = config

test('Failsauce', (t) => {
  t.is('fail', 'superfail', 'Lots of fail. :-(')
})

/*test('processItem()', async (t) => {
  try {
    await processItem({ eventName: 'fake-event' })
    t.fail('Should throw error when event name is invalid.')
  } catch (error) {
    t.pass()
  }

  try {
    await processItem({ eventName: 'ObjectCreated' })
    t.fail('Should throw error when S3 object key is missing.')
  } catch (error) {
    t.pass()
  }

  const promise = processItem(event.Records[0])
  t.notThrows(promise)

  const result = await promise
  t.is(result.length, outputs.length, 'Number of objects uploaded to S3 should match the number of outputs defined in config.')
})*/
