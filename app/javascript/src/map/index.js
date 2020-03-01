import scene from '../scene'
import * as turf from '@turf/turf'
import * as cover from '@mapbox/tile-cover'
import { Vector3 } from 'three'

import config from '../config'

const TOKEN_PARAM = `?access_token=${window.API_TOKEN}`

const terrainTilePath = ([x, y, z]) => {
  return `${config.TERRAIN_BASE_URL}/${z}/${x}/${y}.pngraw${TOKEN_PARAM}`
}

const sataliteTilePath = ([x, y, z]) => {
  return `${config.SATALITE_BASE_URL}/${z}/${x}/${y}@2x.png${TOKEN_PARAM}`
}

const limits = {
  min_zoom: 15,
  max_zoom: 15
}

export class Map {
  constructor () {
    this.path = null // LatLon linestring
    this.bbox = null // LatLon boundingbox
    this.area = null // LatLon tile coverage
    this.center = null // LatLon center point
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
    const projectedFeature = turf.toMercator(this.area)
    return {
      ...projectedFeature,
      features: projectedFeature.features.map((f, cnt) => {
        return {
          ...f,
          properties: {
            tile: tileset[cnt],
            elevation: terrainTilePath(tileset[cnt]),
            texture: sataliteTilePath(tileset[cnt])
          }
        }
      })
    }
  }

  setViewport (geojson) {
    this.bbox = turf.bbox(geojson)
    this.area = this.tileArea()
    this.center = turf.center(this.area)

    const projectedFeature = this.featuresToRender()
    const cameraPoint = this.centerToVector()

    scene.setCameraTarget(cameraPoint)
    scene.setMesh(projectedFeature)
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