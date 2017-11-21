import path from 'path'
import test from 'ava'
import sharp from 'sharp'
import config from './config'
import { getMetadata } from './metadata'

const testImage = path.join(__dirname, 'test image.jpg')
const testS3MetaData = {
  ContentLength: 1024,
  Key: 'obama-test.jpg',
}

test('should have appropriate content-type', async (t) => {
  const stream = sharp(testImage)
  const metadata = await getMetadata(stream, testS3MetaData)

  t.is(metadata.contentType, 'image/jpeg')
  t.is(metadata.exif.image.ImageDescription, 'TEST3')
  t.is(metadata.exif.image.Artist, 'TEST1')
  t.is(metadata.exif.image.Copyright, 'TESTTEST')

  // console.log('\nmetadata:', metadata)
})

test.todo('should return if middleware returns falsey', (t) => {})

test.todo('should include data returned from middleware', (t) => {})

test('should include data from Rekognition if configured', async (t) => {
  const stream = sharp(testImage)
  const metadata = await getMetadata(stream, testS3MetaData)

  console.log('===============================')

  console.log('\nmetadata:', metadata)
})
