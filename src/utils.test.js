/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import test from 'ava'
import config from './config'
import { makeKey } from './utils'

const { destinationPrefix } = config

test('makeKey()', async (t) => {
  const template = 'magical/unicorns/%(directory)s/%(crumbs[1])s/%(filename)s.%(extension)s'
  const context = { key: 'test1/test2/test3/fancy.png', type: 'image/jpeg' }
  const expected = `${destinationPrefix}magical/unicorns/test1/test2/test3/test2/fancy.jpeg`

  const key = makeKey(template, context)

  t.is(key, expected)
})
