import AWS from 'aws-sdk'
import config from './config';

export function imageHandler (event, context, callback) {
  const { Records } = event

  Records.forEach(item => {

  })

  callback(null, { ok: 'did stuff', event, config, Records })
}
