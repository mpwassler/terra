import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { Circle } from 'ol/geom'
import { Fill, Stroke, Style } from 'ol/style'

class AnnotationsLayer {
  constructor () {
    this.source = new VectorSource()
    this.layer = new VectorLayer(this.layerSettings())
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

  drawPoints (annotations) {
    this.source.clear()
    annotations.forEach(annotation => {
      this.drawPoint(annotation.point.coordinates)
    })
  }

  drawPoint (point) {
    const featureToDraw = new Feature({
      geometry: new Circle(point, 0.001)
    })
    this.source.addFeature(featureToDraw)
  }
}

export default AnnotationsLayer
