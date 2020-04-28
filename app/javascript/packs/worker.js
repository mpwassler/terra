import { PlaneBufferGeometry } from 'three'

const THREE = global.THREE = require('three')

require('three/examples/js/utils/BufferGeometryUtils.js')
import config from '../src/config'

const parseMdArray = (rawData) => {
  const elevations = []
  for ( var i = 0, j = 0, l = rawData.length; i < l; i ++, j += 4 ) {
    let R = rawData[j],
        G = rawData[j + 1],
        B = rawData[j + 2]
    elevations.push(rgbToElevation(R, G, B))
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

const buildGeometryFromFeatures = (features) => {
  let geometries = features.map(feature => {
    const { geometry: { coordinates: [coords] } } = feature
    const goemTileWidth = coords[2][0] - coords[0][0]
    return new PlaneBufferGeometry(goemTileWidth, goemTileWidth, config.POINTS_PER_TILE, config.POINTS_PER_TILE)
  })
  return THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false)
}

// onmessage = function({ data: [pixelData, coords, texture] }) {
//   const tileWidth = coords[2][0] - coords[0][0]
//   const geometry = new PlaneBufferGeometry(tileWidth - 50, tileWidth - 50, config.POINTS_PER_TILE, config.POINTS_PER_TILE)
//   var vertices = geometry.attributes.position.array
//   const heights = parseMdArray(pixelData)
//   verticiesWithElevation(heights, vertices)
//   postMessage([vertices, coords, texture])
// }

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
