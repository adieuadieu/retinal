import processItem from './image'

// eslint-disable-next-line import/prefer-default-export
export async function processImage (
  { eventName, Records: records }, context, callback
) {

console.log('hey hey hey hey hey', eventName, records)

  if (eventName.split(':')[0] !== 'ObjectCreated') {
    console.error('Function was invoked without a valid event. Invoked by event name:', eventName)
    return callback(
      `Function was invoked without a valid event. Invoked by event name: ${eventName}`
    )
  }

  try {
    await Promise.all(records.map(processItem))
console.log('promises! 19')
  } catch (error) {
    console.error(error)
    return callback(error, { records })
  }
console.log('got here oh yea :23')
  return callback(null)
}
