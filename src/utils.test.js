import test from 'ava'
import config from './config'
import { makeKey, decodeS3EventKey } from './utils'

const { destinationPrefix } = config

test('makeKey()', (t) => {
  const template = 'magical/unicorns/%(directory)s/%(crumbs[1])s/%(filename)s.%(extension)s'
  const context = { key: 'test1/test2/test3/fancy.png', type: 'image/jpeg' }
  const expected = `${destinationPrefix}magical/unicorns/test1/test2/test3/test2/fancy.jpeg`

  t.is(makeKey(template, context), expected)
  t.throws(
    () => makeKey(undefined, undefined),
    Error,
    'It should throw an Error if neither template or context are provided.',
  )
})

test('decodeS3EventKey()', (t) => {
  const undecoded = 'incoming/test+image+%C3%BCtf+%E3%83%86%E3%82%B9%E3%83%88.jpg'
  const expected = 'incoming/test image ütf テスト.jpg'
  const decoded = decodeS3EventKey(undecoded)

  t.is(decoded, expected)
  t.notThrows(() => decodeS3EventKey(undefined), 'decoding empty string should not throw')
})
