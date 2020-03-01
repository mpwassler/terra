import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  BufferAttribute,
  TextureLoader
} from 'three'

import getPixels from 'get-pixels'
import { chunk, flatten } from 'lodash/array'
import config from '../config'

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

const makeMesh = async (feature) => {
  const { properties: { elevation, texture }, geometry: { coordinates: [coords] } } = feature
  const tileWidth = coords[2][0] - coords[0][0]
  const geometry = new PlaneBufferGeometry(tileWidth, tileWidth, config.POINTS_PER_TILE, config.POINTS_PER_TILE)
  const heights = await getHeightData(elevation)
  var vertices = geometry.attributes.position.array
  const terrainVertices = verticiesWithElevation(heights, vertices)
  geometry.vertices = new Float32Array(terrainVertices)
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(terrainVertices), 3))
  const satTexture = new TextureLoader().load(texture)
  const material = new MeshBasicMaterial({ map: satTexture })
  const mesh = new Mesh(geometry, material)
  mesh.position.set(coords[0][0], coords[0][1], 0)
  return mesh
}

export default {
  makeMesh
}
