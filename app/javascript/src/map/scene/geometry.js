import {
  PlaneBufferGeometry,
  BufferAttribute
} from 'three'

const elevationWorker = new window.Worker(window.TERRAIN_WORKER_URL)

const build = (data, onComplete) => {
  elevationWorker.postMessage(data)
  elevationWorker.onmessage = (event) => {
    const { vertices, meters, gridSize, widthRes, heightRes } = event.data
    const geometry = new PlaneBufferGeometry(
      meters * gridSize[0],
      meters * gridSize[1],
      widthRes - 1,
      heightRes - 1
    )
    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    onComplete(geometry)
  }
}

export default {
  build
}
