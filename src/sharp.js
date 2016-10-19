import sharp from 'sharp'
import config from './config'

export default async function sharpify (input, { all, outputs } = config) {
  const image = sharp(input)

  /* preOperations are performed on the input image and shared across all the outputs */
  all.forEach(([func, ...parameters]) => {
    console.log('op:', func, parameters)
    image[func](...parameters)
  })

  /* each operation will produce a separate file */
  const buffers = await Promise.all(
    outputs.map(async (output) => {
      const clone = await image.clone()

      output.forEach(async ([func, ...parameters]) => {
        console.log('op:', func, parameters)
        await clone[func](...parameters)
      })

      return clone.toBuffer()
    })
  )
console.log('buffers:', buffers)
  return buffers
}
