import * as turf from '@turf/turf'
import { Vector3 } from 'three'

const limits = { min_zoom: 15, max_zoom: 15 }

export class Geography {
  constructor (geojson) {
    this.geojson     = geojson
    this.center      = turf.center(geojson)
    this.boundingBox = turf.bbox(geojson)
    this.polygon     = turf.bboxPolygon(this.boundingBox)
    this.projector   = turf.toMercator
    this.projOpts    = { mutate: true }
  }

  polygonMeters () {
    return this.project(this.polygon.geometry)
  }

  project (feature) {
    return this.projector(feature, this.projOpts)
  }

  centerPoint () {
    const point = this.project(this.center)
    return this.toVector(point)
  }

  toVector (point) {
    return new Vector3(
      point.geometry.coordinates[0],
      point.geometry.coordinates[1],
      point.geometry.coordinates[2]
    )
  }

  bufferBy (distance, units) {
    const originalCenter = turf.center(this.geojson)
    const buffered       = turf.buffer(originalCenter, distance, { units })
    this.boundingBox     = turf.bbox(buffered)
    return this
  }
}
