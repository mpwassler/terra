import { PlaneBufferGeometry } from 'three'

const parseMdArray = (rawData) => {
  const elevations = new Float32Array(rawData.length / 4)
  for (var i = 0, j = 0, l = rawData.length; i < l; i++, j += 4) {
    elevations[i] = rgbToElevation(rawData[j], rawData[j + 1], rawData[j + 2])
  }
  return elevations
}

const rgbToElevation = (R, G, B) => {
  return -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
}

global.onmessage = function ({
  data: {
    pixels,
    meters,
    gridSize,
    postition,
    widthRes,
    heightRes
  }
}) {
  const heights = parseMdArray(pixels.data)
  const geometry = new PlaneBufferGeometry(
    meters * gridSize[0],
    meters * gridSize[1],
    widthRes - 1,
    heightRes - 1
  )

  var vertices = geometry.attributes.position.array
  for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 2] = heights[i]
  }

  global.postMessage({ meters, gridSize, postition, vertices, widthRes, heightRes })
}
