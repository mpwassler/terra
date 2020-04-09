import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import {Point, Circle} from 'ol/geom'
import {Fill, Stroke, Style} from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON'

import * as turf from '@turf/turf'
import {throttle} from 'lodash/function'

class SearchResultsLayer {
  constructor(features) {
    this.source = new VectorSource()
    this.layer  = new VectorLayer(this.layerSettings())
    this.features   = features
  }

  layerSettings () {
    return {
      source: this.source,
      style:  this.styleFunc      
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
  
  addFeatures (features) {   
    features.forEach( linestring => {
      let [feature] = (new GeoJSON()).readFeatures(linestring)
      this.source.addFeature( feature )
    })
  }
}


export default SearchResultsLayer