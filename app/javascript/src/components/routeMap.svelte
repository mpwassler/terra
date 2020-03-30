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

  import {pointToEdit} from '../stores/hikeEditStore'

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

  const getData = () => JSON.parse(window.PATH_DATA)

  const getLineStart = (feature) => first(feature.coordinates)

  const getLineEnd = (feature) => last(feature.coordinates)

  const linestring = getData().path
  const center = turf.center(linestring)

  const linestring2d = turf.lineString(linestring.coordinates.map(([lon, lat]) => [lon, lat]))
  console.log(linestring2d.geometry.coordinates[0])

  const start = getLineStart(linestring)
  const end   = getLineEnd(linestring)

  const addedPointSource = new VectorSource()
  const addedPointLayer = new VectorLayer({
      source: addedPointSource,
      style: () => {
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
    })


  const handleMouseMove = (evt) => {       
    var pt = turf.point(evt.coordinate)  	    
	var snapped = turf.nearestPointOnLine(linestring, pt, {units: 'miles'})	
	let [feature] = addedPointSource.getFeatures()
	if (!feature) {
    	const rolloverFeature = new Feature({
    		geometry: new Circle(snapped.geometry.coordinates, 0.001),
    		name: 'hover'
    	})  	    	
    	addedPointSource.addFeature(rolloverFeature)  	    		
	} else {
		feature.setGeometry(new Circle(snapped.geometry.coordinates, 0.001))  	    		
	}
  }

  const handleMouseDelayed = throttle(handleMouseMove, 100)

  const handleClick = (evt) => {
  	var pt = turf.point(evt.coordinate)  	    
	var snapped = turf.nearestPointOnLine(linestring, pt, {units: 'miles'})
	pointToEdit.set(snapped)
  	debugger
  }
 

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
  	    addedPointLayer
  	  ],
  	  view: new View({
  	    projection: 'EPSG:4326',
  	    center: center.geometry.coordinates,
  	    zoom: 14
  	  })
  	})
  	map.on('pointermove', handleMouseDelayed)
  	map.on('click', handleClick)
  })

</script>

<style>
  
</style>

<div class="map" bind:this={container}>
	{#if $pointToEdit}
		<div class="modal is-active">
		  <div class="modal-background"></div>
		  <div class="modal-card">
		    <header class="modal-card-head">
		      <p class="modal-card-title">Modal title</p>
		      <button class="delete" aria-label="close"></button>
		    </header>
		    <section class="modal-card-body">
		      <!-- Content ... -->
		    </section>
		    <footer class="modal-card-foot">
		      <button class="button is-success">Save changes</button>
		      <button class="button">Cancel</button>
		    </footer>
		  </div>
		</div>
	{/if}
	{#if map}
		<slot></slot>
	{/if}
</div>