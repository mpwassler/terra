
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import config from '../config'
import geometry from './geometry'
import { GeoLine } from './geoline'

// Initilaize and set up the 3d scene
const width = window ? window.innerWidth : 1000
const height = window ? window.innerHeight : 1000
const scene = new Scene()
const camera = new PerspectiveCamera(75, width / height, 0.1, config.VIEW_RANGE)
const renderer = new WebGLRenderer()
camera.up.set(0, 0, 1)
const controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(width, height)
if (document.body) document.body.appendChild(renderer.domElement)
controls.update()

const setCameraTarget = (center) => {
  controls.target = center
  controls.update()
  camera.position.set(
    controls.target.x,
    controls.target.y,
    6000
  )
}

const setMesh = ({ features }) => {
  features.forEach(async (feature) => {
    const mesh = await geometry.makeMesh(feature)
    scene.add(mesh)
  })
}

const drawLine = (geojson) => {
  const line = new GeoLine(geojson)
  scene.add(line.toMesh())
}

const animationLoop = () => {
  if (!window.requestAnimationFrame) return false
  window.requestAnimationFrame(animationLoop)
  controls.update()
  renderer.render(scene, camera)
}

const start = async () => {
  animationLoop()
}

export default {
  start,
  setCameraTarget,
  setMesh,
  drawLine
}
