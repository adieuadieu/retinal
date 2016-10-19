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
    [
      ['resize', 100, 100],
    ],
    [
      ['resize', 200, 200],
    ],
  ],
}

test('optimise image based on configuration options', async (t) => {
  const images = await sharpify(testImage, options)

  t.is(images.length, options.outputs.length, 'number of images matches number of defined outputs')

  await Promise.all(images.map(async (image, index) => {
    const { width, height, format } = await sharp(image).metadata()

    t.is(width, options.outputs[index][0][1], 'image height matches height of defined output')
    t.is(height, options.outputs[index][0][2], 'image width matches width of defined output')

    t.is(format, options.all[0][1], 'image format matches format defined for all images')
  }))
})
