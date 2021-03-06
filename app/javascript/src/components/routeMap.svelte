<script>
  import { onMount, setContext } from 'svelte'
  import Map from 'ol/Map'
  import View from 'ol/View'
  import Feature from 'ol/Feature'
  import TileLayer from 'ol/layer/Tile'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import OSM from 'ol/source/OSM'
 
  import {Point, Circle} from 'ol/geom'
  import {XYZ} from 'ol/source'
  import {Fill, Stroke, Style} from 'ol/style'
  import * as turf from '@turf/turf'
  import {first, last} from 'lodash/array'
  import {throttle} from 'lodash/function'
  import {defaults as defaultControls} from 'ol/control'
  import MousePosition from 'ol/control/MousePosition'
  import {createStringXY} from 'ol/coordinate'

  import MouseOverLayer from '../openlayer/layers/mouseOverLayer'
  import AnnotationsLayer from '../openlayer/layers/AnnotationsLayer'

  import { pointToEdit, hike } from '../stores/hikeEditStore'

  let container
  let map



  const circleFactory = ({line, fill, center}) => {
    return new VectorLayer({
      source: new VectorSource({
        features: [ new Feature(new Circle(center, 0.001)) ]
      }),
      style: () => {
        return new Style({
          stroke: new Stroke({
            color: line,
            width: 2
          }),
          fill: new Fill({
            color: fill
          })
        })
      }
    })
  }

  const lineFactory = ({ linestring }) => {
    return new VectorLayer({
      source: new VectorSource({
        features: (new GeoJSON()).readFeatures(linestring)
      }),
      style: () => {
        return new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1
          })
        })
      }
    })
  }

  const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    undefinedHTML: '&nbsp;'
  })
  
  const linestring = $hike.path
  const center = turf.center(linestring)

  const linestring2d = turf.lineString(linestring.coordinates.map(([lon, lat]) => [lon, lat]))
  console.log(linestring2d.geometry.coordinates[0])

  const start = first(linestring.coordinates)
  const end   = last(linestring.coordinates)

  
  const mouseOver = new MouseOverLayer(linestring)
  const annotations = new AnnotationsLayer()


  const handleClick = (evt) => {
  	var pt = turf.point(evt.coordinate)  	    
	  var snapped = turf.nearestPointOnLine(linestring, pt, {units: 'miles'})
    var clickPoint = turf.point(linestring.coordinates[snapped.properties.index])
	  pointToEdit.set({geojson: clickPoint})
  	
  }

  const unsubscribe = hike.subscribe((hike) => {
    annotations.drawPoints(hike.hike_annotations)    
  })
 

  onMount(() => {
  	map = new Map({
  	  target: container,
  	  controls: defaultControls().extend([mousePositionControl]),
  	  layers: [
  	    new TileLayer({
  	      source: new XYZ({
  	        url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token=${window.API_TOKEN}`
  	      })
  	    }),
  	    lineFactory({ linestring }),
  	    circleFactory({line: 'green', fill: 'rgba(0,255,0,0.8)', center: start}),
  	    circleFactory({line: 'red', fill: 'rgba(255,0,0,0.25)', center: end}),
  	    mouseOver.layer,
        annotations.layer
  	  ],
  	  view: new View({
  	    projection: 'EPSG:4326',
  	    center: center.geometry.coordinates,
  	    zoom: 13.5
  	  })
  	})
  	map.on('pointermove', mouseOver.handleMouseOver())
  	map.on('click', handleClick)


  })

</script>

<style>
  
</style>
<div class="box">
  <div class="map" bind:this={container}>  
</div>
	
	{#if map}
		<slot></slot>
	{/if}
</div>