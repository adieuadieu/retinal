import path from 'path'
import test from 'ava'
import sharp from 'sharp'
import sharpify from './sharp'

const testImage = path.join(__dirname, 'test image.jpg')

const options = {
  all: [['toFormat', 'webp', { quality: 80 }], ['rotate', 90]],
  outputs: [
    {
      operations: [['resize', 100, 201]],
    },
    {
      operations: [['resize', 200, 100]],
    },
  ],
}

const { all, outputs } = options

test('process input image based on configuration options', async (t) => {
  t.throws(sharpify(undefined, undefined, undefined), TypeError)

  const imageStreams = await sharpify(testImage, options, false)
  const imageBuffers = await sharpify(testImage, options, true)

  t.true(imageStreams[0] instanceof sharp)
  t.true(imageBuffers[0] instanceof Buffer)

  t.is(
    imageBuffers.length,
    outputs.length,
    'number of images should match the number of defined outputs'
  )

  await Promise.all(
    imageBuffers.map(async (image, index) => {
      const { operations } = outputs[index]
      const { width, height, format } = await sharp(image).metadata()

      t.is(width, operations[0][1], 'image width should match height of defined output')
      t.is(height, operations[0][2], 'image height should match width of defined output')

      t.is(format, all[0][1], 'image format should match format defined for all images')
    })
  )
})
