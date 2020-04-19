import getPixels from 'get-pixels'
import { chunk, flatten } from 'lodash/array'

const getHeightData = (path) => {
  return new Promise((resolve, reject) => {
    getPixels(path, (err, pixels) => {
      if (err) return reject(err)
      const heights = parseMdArray(pixels.data)
      resolve(heights)
    })
  })
}

const parseMdArray = (rawData) => {
  return chunk(rawData, 4)
    .map(rgbToElevation)
}

const rgbToElevation = ([R, G, B, A]) => {
  return -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
}

const verticiesWithElevation = (heights, vertices) => {
  const points = chunk(vertices, 3)
  const pointsWithElevation = points.map(([x, y, z], cnt) => {
    return [x, y, heights[cnt]]
  })
  return flatten(pointsWithElevation)
}

onmessage = function({ data: [pixelData, planeVerticies, coords, texture] }) {
  const heights = parseMdArray(pixelData)
  const terrainVertices = verticiesWithElevation(heights, planeVerticies)
  postMessage([terrainVertices, coords, texture])
}
