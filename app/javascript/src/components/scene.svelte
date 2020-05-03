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

		  $slideIndex = 0

		  map3d = new Map({
		  	element: container,
		  	feature: data.path,
		  	buffer: 2,
		  	bufferUnit: 'miles',
		  	resolutionMultiple: 1,
		  })

		  map3d.drawLine(data.path)

		  data.hike_annotations.forEach(annotation => {
		  	map3d.drawMarker(annotation.point)
		  })
		  setTimeout(() => {
			  if ($selectedAnottation) {
			  	map3d.focusOn($selectedAnottation.point)
			  }
		  }, 1000)
	}

	onMount(() => {
		setup()
	})
</script>

<div class="map" bind:this={container}></div>
