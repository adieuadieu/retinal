import sharp from 'sharp'

const options = { all: [], outputs: [] }

export default async function sharpify (input, { all, outputs } = options, toBuffer = false) {
  const image = sharp(input)

  /* preOperations are performed on the input image and shared across all the outputs */
  all.forEach(([func, ...parameters]) => image[func](...parameters))

  /* each operation will produce a separate file */
  return await Promise.all(
    outputs.map(async ({ operations }) => {
      const clone = await image.clone()

      operations.forEach(async ([func, ...parameters]) => await clone[func](...parameters))

      return toBuffer ? clone.toBuffer() : clone
    })
  )
}
