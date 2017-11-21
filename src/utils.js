import { sprintf } from 'sprintf-js'
import mime from 'mime-types'
import config from './config'

const { destinationPrefix } = config

export function makeKey (template, context) {
  if (!template || !context) {
    throw new Error('makeKey requires both a template string and a context')
  }

  const crumbs = context.key.split('/')
  const directory = crumbs.slice(0, crumbs.length - 1).join('/')
  const filename = crumbs[crumbs.length - 1].split('.')[0]
  const values = {
    ...context,
    crumbs,
    directory,
    filename,
    extension: mime.extension(context.type),
  }

  return `${destinationPrefix}${sprintf(template, values)}`
}

export function decodeS3EventKey (key) {
  return key && key.length ? decodeURIComponent(key.replace(/\+/g, ' ')) : key
}

export function encodeS3Key (key) {
  return key && key.length ? encodeURIComponent(key.replace(' ', '+')) : key
}
