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

const getPixelArray = (path) => {
  return new Promise((resolve, reject) => {
    getPixels(path, (err, pixels) => {
      if (err) return reject(err)
      resolve(pixels.data)
    })
  })
}

const handleWorkerPostback = (onComplete) => {
  return ({ data: [terreinData, coords, texture] }) => {
    const tileWidth = coords[2][0] - coords[0][0]
    const material = new MeshBasicMaterial({ map: new TextureLoader().load(texture) })
    const geometry = new PlaneBufferGeometry(tileWidth, tileWidth, config.POINTS_PER_TILE, config.POINTS_PER_TILE)
    geometry.setAttribute('position', new BufferAttribute(terreinData, 3))
    const mesh = new Mesh(geometry, material)
    mesh.position.set(coords[0][0], coords[0][1], 0)
    onComplete(mesh)
  }
}

const makeMesh = async (feature, onComplete) => {
  const { properties: { elevation, texture }, geometry: { coordinates: [coords] } } = feature
  const pixels = await getPixelArray(elevation)
  elevationWorker.postMessage([pixels, coords, texture])
  elevationWorker.onmessage = handleWorkerPostback(onComplete)
}

export default {
  makeMesh
}
