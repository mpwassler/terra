import {
  PlaneBufferGeometry,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  BufferAttribute,
  TextureLoader,
  CanvasTexture
} from 'three'

import { TextureBuilder } from './textureBuilder'
import getPixels from 'get-pixels'
import { chunk, flatten } from 'lodash/array'
import config from '../config'
var tilebelt = require('@mapbox/tilebelt')

const elevationWorker = new Worker(TERRAIN_WORKER_URL)

const getPixelArray = (path) => {
  return new Promise((resolve, reject) => {
    getPixels(path, (err, pixels) => {
      if (err) return reject(err)
      resolve(pixels.data)
    })
  })
}

// const handleWorkerPostback = (onComplete) => {
//   return async ({ data: [terreinData, coords, texture] }) => {


//     // let texures = tilebelt.getChildren(texture).map(tile => {
//     //   return tilebelt.getChildren(tile)
//     // })

//     // let imageBuilder = new TextureBuilder({
//     //   tiles: flatten(texures),
//     // })
//     // await imageBuilder.process()
//     // const tileWidth = coords[2][0] - coords[0][0]
//     // const material = new MeshBasicMaterial({ map: new CanvasTexture(imageBuilder.canvas) })
//     // let p = config.POINTS_PER_TILE
//     // const geometry = new PlaneBufferGeometry(0, 0, p, p)
//     // geometry.setAttribute('position', new BufferAttribute(terreinData, 3))



//     // const mesh = new Mesh(geometry, material)
//     // mesh.position.set(coords[0][0], coords[0][1], 0)
//     // onComplete(mesh)
//   }
// }

const handleWorkerPostback = (onComplete) => {
  return async (event) => {
    let {vertices, meters, gridSize, postition, widthRes, heightRes} = event.data

    const geometry = new PlaneBufferGeometry(
      meters * gridSize[0],
      meters * gridSize[1],
      widthRes -1,
      heightRes -1
    )

    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    const material = new MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    // const material = new MeshBasicMaterial({ map: new CanvasTexture(imageBuilder.canvas) })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(postition[0], postition[1], 0)

    // let texures = tilebelt.getChildren(texture).map(tile => {
    //   return tilebelt.getChildren(tile)
    // })

    // let imageBuilder = new TextureBuilder({
    //   tiles: flatten(texures),
    // })
    // await imageBuilder.process()
    // const tileWidth = coords[2][0] - coords[0][0]
    // let p = config.POINTS_PER_TILE
    // const geometry = new PlaneBufferGeometry(0, 0, p, p)
    // geometry.setAttribute('position', new BufferAttribute(terreinData, 3))



    // const mesh = new Mesh(geometry, material)
    // mesh.position.set(coords[0][0], coords[0][1], 0)
    onComplete(geometry)
  }
}


const makeMesh = async (feature, onComplete) => {
  const { properties: { elevation, texture }, geometry: { coordinates: [coords] } } = feature
  const pixels = await getPixelArray(elevation)
  elevationWorker.postMessage([pixels, coords, texture])
  elevationWorker.onmessage = handleWorkerPostback(onComplete)
}

const makeSingleMesh = (data, onComplete) => {

  elevationWorker.postMessage(data)
  elevationWorker.onmessage = handleWorkerPostback(onComplete)
}

export default {
  makeMesh,
  makeSingleMesh
}
