import { sprintf } from 'sprintf-js'
import mime from 'mime-types'
import config from './config'

const { destinationPrefix } = config

// eslint-disable-next-line import/prefer-default-export
export function makeKey (template = '%(key)', context = {}) {
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
