import {
  PlaneBufferGeometry,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  BufferAttribute,
  TextureLoader,
  CanvasTexture
} from 'three'

import config from '../../config'

const elevationWorker = new Worker(TERRAIN_WORKER_URL)

const build = (data, onComplete) => {
  elevationWorker.postMessage(data)
  elevationWorker.onmessage = (event) => {
    let {vertices, meters, gridSize, postition, widthRes, heightRes} = event.data
    const geometry = new PlaneBufferGeometry(
      meters * gridSize[0],
      meters * gridSize[1],
      widthRes -1,
      heightRes -1
    )
    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    onComplete(geometry)
  }
}

export default {
  build
}
