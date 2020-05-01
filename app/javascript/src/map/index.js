import scene from './scene'
import * as turf from '@turf/turf'
import { Vector3 } from 'three'
import { Linestring } from './geography/linestring.js'
import Marker from './scene/marker'

import { TileGrid } from './tiles/tile-grid'
import { TextureBuilder } from './scene/textureBuilder'


const getTileMeters = (feature) => {
  let a = feature.geometry.coordinates[0][2][0]
  let b = feature.geometry.coordinates[0][0][0]
  return a - b
}

export class Map {
  constructor (opts) {
    console.log(opts)
    this.element = opts.element
    this.opts    = opts
    this.init()
  }

  async init () {
    this.feature = new Linestring(this.opts.feature)

    const bufferSize = this.opts.buffer || 2.5

    const bufferUnit = this.opts.bufferUnit || 'miles'

    const { tiles, polygons, center } = this.feature
                                            .bufferBy(bufferSize, bufferUnit)
                                            .getTiles()

    let metersPerTile = getTileMeters(polygons.features[0])

    let elevationGrid = new TileGrid({ tiles })

    let textureBuilder = new TextureBuilder(elevationGrid, 'terrain')

    let pixelData = await textureBuilder.pixelData()

    const meshConfig = {
      tiles: tiles,
      center: center,
      features: polygons,
      gridRows:    elevationGrid.shape.rows,
      gridColumns: elevationGrid.shape.columns,
      xResolution: elevationGrid.width,
      yResolutuin: elevationGrid.height,
      metersPerTile,
      pixelData
    }

    scene.initilaize(this.element)

    scene.setCameraTarget(center)

    scene.setMesh(meshConfig)

    scene.start()
  }

  drawLine (geojson) {
    const linestring = new Linestring(geojson)
    scene.drawLine(this.feature.path)
  }

  drawMarker (point) {
    const position = this.pointToVector(point)
    const marker = new Marker(position)

    scene.add(marker.sprite)
  }

  focusOn (point) {
    scene.lookAt(this.pointToVector(point))
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
