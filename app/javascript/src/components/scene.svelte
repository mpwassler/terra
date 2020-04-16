<script>
	import { onMount, setContext } from 'svelte'
	import { Map } from '../map'
	import {slideIndex, anottations, selectedAnottation} from '../stores/hikeShowStore'


	let container 

	let map3d
	
	const getData = () => {
	  return window.PATH_DATA
	}

	
	selectedAnottation.subscribe( annotation => {
		if(map3d) {
			map3d.focusOn(annotation.point)			
		}
	})
	
	const setup = () => {
		  const data = getData()
		  map3d = new Map({ element: container})
		  map3d.setViewport(data.path)
		  data.hike_annotations.forEach(annotation => {
		  	map3d.addMarker(annotation.point)	  
		  })
		  if ($selectedAnottation) {
		  	map3d.focusOn($selectedAnottation.point)
		  }
		  map3d.render()  	
	}

	onMount(() => {
		setup()
	})
</script>

<div class="map" bind:this={container}></div>
