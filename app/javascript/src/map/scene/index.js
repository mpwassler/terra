
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Mesh,
  MeshBasicMaterial,
  CanvasTexture,
  LinearFilter
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from './shaders/sun.js'
import config from '../../config'
import geometry from './geometry'
import { GeoLine } from './geoline'
import { TextureBuilder } from './textureBuilder'
import gsap from 'gsap'
import { flatten } from 'lodash/array'

import { TileGrid } from '../tiles/tile-grid'
var tilebelt = require('@mapbox/tilebelt')

const configureSun = (center) => {
  const sky = new Sky()
  sky.scale.setScalar(30000)
  sky.position.set(center.x, center.y, center.z)
  scene.add(sky)

  var effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.3448, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: !true
  }
  var distance = 400000

  function guiChanged () {
    var uniforms = sky.material.uniforms
    uniforms.up.value = new Vector3(0, 0, 1)
    uniforms.turbidity.value = effectController.turbidity
    uniforms.rayleigh.value = effectController.rayleigh
    uniforms.mieCoefficient.value = effectController.mieCoefficient
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG
    uniforms.luminance.value = effectController.luminance

    var theta = Math.PI * (effectController.inclination - 0.5)
    var phi = 2 * Math.PI * (effectController.azimuth - 0.5)

    const pos = new Vector3()

    pos.x = distance * Math.cos(phi)
    pos.z = distance * Math.sin(phi) * Math.sin(theta)
    pos.y = distance * Math.sin(phi) * Math.cos(theta)

    uniforms.sunPosition.value = pos
    uniforms.cameraPos.value = new Vector3(center.x, center.y, center.z)

    renderer.render(scene, camera)
  }

  guiChanged()
  //
}

// Initilaize and set up the 3d scene
const width = window ? window.innerWidth : 1000
const height = window ? window.innerHeight * 0.75 : 1000
const scene = new Scene()
const camera = new PerspectiveCamera(75, width / height, 0.1, config.VIEW_RANGE)
var canvas = document.createElement('canvas')
var context = canvas.getContext('webgl2', { alpha: false })
const renderer = new WebGLRenderer({ canvas: canvas, context: context })
camera.up.set(0, 0, 1)
const controls = new OrbitControls(camera, renderer.domElement)

document.addEventListener('turbolinks:before-render', () => {
  if (scene.children.length) {
    scene.remove.apply(scene, scene.children)
  }
})

const initilaize = (element) => {
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  if (element) element.appendChild(renderer.domElement)
  controls.update()
}

const setCameraTarget = (center) => {
  const vec = new Vector3(center.x, center.y, center.z)
  configureSun(vec)

  controls.target = vec
  controls.update()
  camera.position.set(
    controls.target.x,
    controls.target.y - 2000,
    7000
  )
}

const buildMaterial = async (tiles) => {
  const tileZoom1 = tiles.map(tileInfo => {
    return tilebelt.getChildren(tileInfo)
  })

  const textrueGrid = new TileGrid({ tiles: flatten(tileZoom1) })
  const textureBuilder = new TextureBuilder(textrueGrid)

  await textureBuilder.process()
  const texture = new CanvasTexture(textureBuilder.canvas)
  // do this only on desktop
  texture.minFilter = LinearFilter
  const material = new MeshBasicMaterial({ map: texture })
  return material
}

const setMesh = async (meshConfig) => {
  geometry.build({
    pixels: meshConfig.pixelData,
    meters: meshConfig.metersPerTile,
    gridSize: [meshConfig.gridColumns, meshConfig.gridRows],
    widthRes: meshConfig.xResolution,
    heightRes: meshConfig.yResolutuin
  }, async (geometry) => {
    buildMaterial(meshConfig.tiles).then(material => {
      const mesh = new Mesh(geometry, material)
      mesh.position.set(meshConfig.center.x, meshConfig.center.y, 0)
      scene.add(mesh)
    })
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

const add = (obj) => {
  scene.add(obj)
}

const lookAt = ({ x, y, z }) => {
  const animationSettings = {
    ease: 'power3.out',
    duration: 1
  }
  gsap.to(camera.position, {
    ...animationSettings,
    x,
    y: (y + 500),
    z: (z + 1500)
  })
  gsap.to(controls.target, { ...animationSettings, x: x, y: y, z })
}

export default {
  start,
  setCameraTarget,
  setMesh,
  drawLine,
  initilaize,
  add,
  lookAt
}