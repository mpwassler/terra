<script>
import Map from 'ol/Map'
import View from 'ol/View'
import Feature from 'ol/Feature'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import { onMount, setContext } from 'svelte'
import {XYZ} from 'ol/source'
import { searchPoint, results } from '../stores/searchStore'
import SearchResultsLayer from '../openlayer/layers/searchResultsLayer'

export let center

let container
let map

const searchLayer = new SearchResultsLayer()

searchPoint.subscribe(value => {
	center = value
	if(map) {	
		map.getView().setCenter(center)
	}
})

results.subscribe(results => {
	searchLayer.addFeatures(results.map(result => result.path))
})

onMount(() => {
	map = new Map({
	  target: container,
	  layers: [
	    new TileLayer({
	      source: new XYZ({
	        url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token=${window.API_TOKEN}`
	      })
	    }),
	    searchLayer.layer	    
	  ],
	  view: new View({
	    projection: 'EPSG:4326',
	    center: center,
	    zoom: 10
	  })
	})
})

</script>


<div class="box">
  <div style="height: 500px;position: relative;" class="map" bind:this={container}>  
  </div>
	
	{#if map}
		<slot></slot>
	{/if}
</div>