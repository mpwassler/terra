import scene from './scene'
import * as turf from '@turf/turf'
import { Vector3 } from 'three'
import { Linestring } from './geography/linestring.js'
import Marker from './scene/marker'

import { TileGrid } from './tiles/tile-grid'
import { TextureBuilder } from './scene/textureBuilder'

const getTileMeters = (feature) => {
  const a = feature.geometry.coordinates[0][2][0]
  const b = feature.geometry.coordinates[0][0][0]
  return a - b
}

export class Map {
  constructor (opts) {
    console.log(opts)
    this.element = opts.element
    this.opts = opts
    this.scene = scene
    this.init()
  }

  async init () {
    this.feature = new Linestring(this.opts.feature)

    const bufferSize = this.opts.buffer || 2.5

    const bufferUnit = this.opts.bufferUnit || 'miles'

    const { tiles, polygons, center } = this.feature
      .bufferBy(bufferSize, bufferUnit)
      .getTiles()

    const metersPerTile = getTileMeters(polygons.features[0])

    const elevationGrid = new TileGrid({ tiles })

    const textureBuilder = new TextureBuilder(elevationGrid, 'terrain')

    const pixelData = await textureBuilder.pixelData()

    const meshConfig = {
      tiles: tiles,
      center: center,
      features: polygons,
      gridRows: elevationGrid.shape.rows,
      gridColumns: elevationGrid.shape.columns,
      xResolution: elevationGrid.width,
      yResolutuin: elevationGrid.height,
      metersPerTile,
      pixelData
    }

    this.scene.initilaize(this.element)

    this.scene.setCameraTarget(center)

    this.scene.setMesh(meshConfig)

    this.scene.start()
  }

  drawLine (geojson) {
    const linestring = new Linestring(geojson)
    this.scene.drawLine(linestring.path)
  }

  drawMarker (point) {
    const position = this.pointToVector(point)
    const marker = new Marker(position)

    this.scene.add(marker.sprite)
  }

  focusOn (point) {
    this.scene.lookAt(this.pointToVector(point))
  }

  pointToVector (point) {
    const projectedPoint = turf.toMercator(point)
    return new Vector3(
      projectedPoint.coordinates[0],
      projectedPoint.coordinates[1],
      projectedPoint.coordinates[2] + 75
    )
  }
}
