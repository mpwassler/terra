
import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from './shaders/sun.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'

import config from '../config'
import geometry from './geometry'
import { GeoLine } from './geoline'

const configureSun = (center) => {
  const sky = new Sky()
  sky.scale.setScalar( 30000 )
  sky.position.set(center.x, center.y, center.z)
  scene.add( sky )

  var effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.3448, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: ! true
  }
  var distance = 400000
  

  function guiChanged() {

    var uniforms = sky.material.uniforms
    uniforms[ "up" ].value = new Vector3(0,0,1)
    uniforms[ "turbidity" ].value = effectController.turbidity
    uniforms[ "rayleigh" ].value = effectController.rayleigh
    uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient
    uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG
    uniforms[ "luminance" ].value = effectController.luminance

    var theta = Math.PI * ( effectController.inclination - 0.5 )
    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 )

    const pos = new Vector3()

    pos.x = distance * Math.cos( phi )
    pos.z = distance * Math.sin( phi ) * Math.sin( theta )
    pos.y = distance * Math.sin( phi ) * Math.cos( theta )

    uniforms[ "sunPosition" ].value = pos
    uniforms[ "cameraPos" ].value = new Vector3(center.x, center.y, center.z)

    renderer.render( scene, camera );

  }

  var gui = new GUI();

  gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
  gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
  gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
  gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
  gui.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
  gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
  gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
  
  guiChanged()
  // 
}

// Initilaize and set up the 3d scene
const width = window ? window.innerWidth : 1000
const height = window ? window.innerHeight : 1000
const scene = new Scene()
const camera = new PerspectiveCamera(75, width / height, 0.1, config.VIEW_RANGE)
const renderer = new WebGLRenderer()
camera.up.set(0, 0, 1)
const controls = new OrbitControls(camera, renderer.domElement)



document.addEventListener('turbolinks:before-render', () => {
  if (scene.children.length) {
    scene.remove.apply(scene, scene.children)
  }
})

const initilaize = () => {
  renderer.setSize(width, height)
  if (document.querySelector('.map3d')) document.querySelector('.map3d').appendChild(renderer.domElement)
  controls.update()

}

const setCameraTarget = (center) => {
  
  configureSun(center)

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
  drawLine,
  initilaize
}
