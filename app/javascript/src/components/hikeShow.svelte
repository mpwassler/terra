<script>
	import { getContext } from 'svelte'
	import Scene from './scene.svelte'
	import Caurosel from './caurosel.svelte'
	import {slideIndex, anottations, selectedAnottation} from '../stores/hikeShowStore'
	import ImageGallery from './imageGallery.svelte'

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
<div class="slides">
	<Caurosel changeHandler={changeHandler}>
		{#each $anottations as annotation}
			<div class="carousel-cell box" style="width: 88%;">
				{annotation.copy}
			</div>
		{/each}
	</Caurosel>
</div>

{#if $selectedAnottation}
  <ImageGallery images={$selectedAnottation.images}></ImageGallery>
{/if}
