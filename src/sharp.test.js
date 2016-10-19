/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import test from 'ava'
import sharp from 'sharp'
import sharpify from './sharp'

const testImage = './test.jpg'

const options = {
  all: [
    ['toFormat', 'webp'],
    ['rotate', 90],
  ],
  outputs: [
    {
      operations: [
        ['resize', 100, 100],
      ],
    },
    {
      operations: [
        ['resize', 200, 200],
      ],
    },
  ],
}

const { all, outputs } = options

test('optimise image based on configuration options', async (t) => {
  const images = await sharpify(testImage, options, true)

  t.is(images.length, outputs.length, 'number of images should match the number of defined outputs')

  await Promise.all(images.map(async (image, index) => {
    const { operations } = outputs[index]
    const { width, height, format } = await sharp(image).metadata()

    t.is(width, operations[0][1], 'image height should match height of defined output')
    t.is(height, operations[0][2], 'image width should match width of defined output')

    t.is(format, all[0][1], 'image format should match format defined for all images')
  }))
})
