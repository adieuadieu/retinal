import sharp from 'sharp'

const options = { all: [], outputs: [] }

export default async function sharpify (input, { all, outputs } = options, toBuffer = false) {
  if (!input) throw new TypeError('sharpify() expects first parameter to be a valid image input.')

  const image = sharp(input)

  /* preOperations are performed on the input image and shared across all the outputs */
  all.forEach(([func, ...parameters]) => image[func](...parameters))

  /* each output will produce a separate file */
  return Promise.all(
    outputs.map(async ({ operations }) => {
      const clone = await image.clone()

      operations.forEach(([func, ...parameters]) => clone[func](...parameters))
      return toBuffer ? clone.toBuffer() : clone
    })
  )
}
