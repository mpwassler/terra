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
const elevationWorker = new Worker(WORKER_URL)
const textureMap = {}
const getHeightData = (path) => {
  return new Promise((resolve, reject) => {
    getPixels(path, (err, pixels) => {
      if (err) return reject(err)
      const heights = parseMdArray(pixels.data)
      resolve(heights)
    })
  })
}

const getPixelArray = (path) => {
  return new Promise((resolve, reject) => {
    getPixels(path, (err, pixels) => {
      if (err) return reject(err)
      resolve(pixels.data)
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

const makeMesh = async (feature, onComplete) => {

  const { properties: { elevation, texture }, geometry: { coordinates: [coords] } } = feature
  const tileWidth = coords[2][0] - coords[0][0]
  const geometry = new PlaneBufferGeometry(tileWidth, tileWidth, config.POINTS_PER_TILE, config.POINTS_PER_TILE)
  var vertices = geometry.attributes.position.array
  const pixels = await getPixelArray(elevation)
  elevationWorker.postMessage([pixels, vertices, coords, texture])
  textureMap[texture] = new TextureLoader().load(texture)

  elevationWorker.onmessage = ({ data: [terreinData, coords, texture] }) => {
    const material = new MeshBasicMaterial({ map: textureMap[texture] })
    const geometry = new PlaneBufferGeometry(tileWidth, tileWidth, config.POINTS_PER_TILE, config.POINTS_PER_TILE)
    geometry.vertices = new Float32Array(terreinData)
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(terreinData), 3))
    const mesh = new Mesh(geometry, material)
    mesh.position.set(coords[0][0], coords[0][1], 0)
    onComplete(mesh)
  }
}

export default {
  makeMesh
}
