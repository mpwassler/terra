import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { Circle } from 'ol/geom'
import { Fill, Stroke, Style } from 'ol/style'
import * as turf from '@turf/turf'
import { throttle } from 'lodash/function'

class MouseOverLayer {
  constructor (line) {
    this.source = new VectorSource()
    this.layer = new VectorLayer(this.layerSettings())
    this.line = line
  }

  layerSettings () {
    return {
      source: this.source,
      style: this.styleFunc
    }
  }

  styleFunc () {
    return new Style({
      stroke: new Stroke({
        color: 'green',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(0,255,0,0.8)'
      })
    })
  }

  handleMouseOver () {
    return throttle((evt) => {
      var pt = turf.point(evt.coordinate)
      var { geometry: { coordinates } } = turf.nearestPointOnLine(this.line, pt, { units: 'miles' })
      const [feature] = this.source.getFeatures()
      if (!feature) {
        const rolloverFeature = new Feature({
          geometry: new Circle(coordinates, 0.001),
          name: 'hover'
        })
        this.source.addFeature(rolloverFeature)
      } else {
        feature.setGeometry(new Circle(coordinates, 0.001))
      }
    }, 100)
  }
}

export default MouseOverLayer
