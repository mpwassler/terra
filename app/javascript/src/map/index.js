import scene from './scene'
import * as turf from '@turf/turf'
import * as cover from '@mapbox/tile-cover'
import { Vector3 } from 'three'


import { Linestring } from './geography/linestring.js'

import Marker from './scene/marker'

import config from '../config'

const limits = {
  min_zoom: 15,
  max_zoom: 15
}

export class Map {
  constructor (opts) {
    console.log(opts)
    this.element = opts.element
    this.opts    = opts
    this.init()
  }

  init () {
    this.feature = new Linestring(this.opts.feature)

    const center = this.feature.centerPoint()

    const bufferSize = this.opts.buffer || 2.5

    const bufferUnit = this.opts.bufferUnit || 'miles'

    const { tiles, polygons } = this.feature
                                    // .bufferBy(bufferSize, bufferUnit)
                                    .getTiles()
    scene.initilaize(this.element)

    scene.setCameraTarget(center)

    const meshConfig = {
      tiles: tiles,
      center: center,
      features: polygons
    }
    debugger

    scene.setMesh(meshConfig)

    this.render()
  }

  drawLine (geojson) {
    const linestring = new Linestring(geojson)
    scene.drawLine(this.feature.path)
  }

  render (geojson) {
    scene.start()
  }

  showTile (tile) {
    scene.renderTile(tile)
  }

  projectedCenter () {
    return turf.toMercator(this.center)
  }

  bboxPolygon () {
    return turf.bboxPolygon(this.bbox)
  }

  tileArea () {
    return cover.geojson(this.bboxPolygon().geometry, limits)
  }

  featuresToRender () {
    const bbPolygon = this.bboxPolygon()
    const tileset = cover.tiles(bbPolygon.geometry, limits)
    const projectedFeature = turf.toMercator(this.area, {mutate: true})
    return {
      ...projectedFeature,
      features: projectedFeature.features.map((f, cnt) => {
        return {
          ...f,
          properties: {
            tile: tileset[cnt]
          }
        }
      })
    }
  }

  setViewport (geojson) {
    scene.initilaize(this.element)
    // 3-5 mile buffer on desktop
    var buffered = turf.buffer(turf.center(geojson), 3.5, { units: 'miles' })
    // dont buffer, render just enough on mobile
    this.bbox = turf.bbox(buffered)
    this.area = this.tileArea()
    this.center = turf.center(this.area)

    const pathData = turf.toMercator(geojson, {mutate: true})
    const projectedFeature = this.featuresToRender()
    const cameraPoint = this.centerToVector()

    scene.setCameraTarget(cameraPoint)
    scene.setMesh(projectedFeature, this.pointToVector(this.center.geometry))
    scene.drawLine(pathData)
  }

  drawMarker (point) {
    const position = this.pointToVector(point)
    const marker = new Marker(position)

    scene.add(marker.sprite)
  }

  focusOn (point) {
    //scene.lookAt(this.pointToVector(point))
  }

  pointToVector (point) {
    const projectedPoint = turf.toMercator(point)
    return new Vector3(
      projectedPoint.coordinates[0],
      projectedPoint.coordinates[1],
      projectedPoint.coordinates[2] + 75
    )
  }

  centerToVector () {
    const projectedCenter = turf.toMercator(this.center)
    return new Vector3(
      projectedCenter.geometry.coordinates[0],
      projectedCenter.geometry.coordinates[1],
      2500
    )
  }
}
