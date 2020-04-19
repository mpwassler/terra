import { PlaneBufferGeometry } from 'three'
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

onmessage = function({ data: [pixelData, coords, texture] }) {
  const tileWidth = coords[2][0] - coords[0][0]
  const geometry = new PlaneBufferGeometry(tileWidth, tileWidth, config.POINTS_PER_TILE, config.POINTS_PER_TILE)
  var vertices = geometry.attributes.position.array
  const heights = parseMdArray(pixelData)
  verticiesWithElevation(heights, vertices)
  postMessage([vertices, coords, texture])
}
