import { PlaneBufferGeometry } from 'three'
import config from '../src/config'

const parseMdArray = (rawData) => {
  const elevations = new Float32Array(rawData.length / 4)
  for ( var i = 0, j = 0, l = rawData.length; i < l; i ++, j += 4 ) {
    let R = rawData[j],
        G = rawData[j + 1],
        B = rawData[j + 2]
    elevations[i] = rgbToElevation(R, G, B)
  }
  return elevations
}

const rgbToElevation = (R, G, B) => {
  return -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
}

const verticiesWithElevation = (heights, vertices) => {
  for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    vertices[ j + 2 ] = heights[ i ]
  }
}

onmessage = function(event) {
  let {
    pixels,
    meters,
    gridSize,
    postition,
    widthRes,
    heightRes
  } = event.data

  const heights = parseMdArray(pixels.data)

  const geometry = new PlaneBufferGeometry(
    meters * gridSize[0],
    meters * gridSize[1],
    widthRes - 1,
    heightRes - 1
  )
  var vertices = geometry.attributes.position.array
  verticiesWithElevation(heights, vertices)

  postMessage({
    meters,
    gridSize,
    postition,
    vertices,
    widthRes,
    heightRes
  })
}
// onmessage = function({ data: [pixelData, features] }) {

//   let geometry = buildGeometryFromFeatures(features)
//   console.log('1')
//   let coords = features[0].geometry.coordinates[0]
//   console.log('2')
//   // const geometry = new PlaneBufferGeometry(pixelData.width, pixelData.height, pixelData.width, pixelData.height)
//   var vertices = geometry.attributes.position.array
//   console.log('3')
//   const heights = parseMdArray(pixelData.data)
//   console.log(heights)
//   console.log('4')
//   verticiesWithElevation(heights, vertices)
//   console.log('5')
//   postMessage([vertices, coords])
// }
