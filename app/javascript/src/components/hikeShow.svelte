<script>
	import { getContext } from 'svelte'
	import Scene from './scene.svelte'
	import Caurosel from './caurosel.svelte'
	import {slideIndex, anottations, selectedAnottation} from '../stores/hikeShowStore'

	$anottations = PATH_DATA.hike_annotations 

	const changeHandler = (index) => {		
		$slideIndex = index
	}
	
</script>

<style>

</style>

<div class="box map" >
  <Scene></Scene>	
</div>

<Caurosel changeHandler={changeHandler}>
	{#each $anottations as annotation}
		<div class="carousel-cell box" style="width: 60%;">
			{annotation.copy}
		</div>
	{/each}		
</Caurosel>