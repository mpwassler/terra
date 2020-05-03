<script>
	import { getContext } from 'svelte'
	import Scene from './scene.svelte'
	import Caurosel from './caurosel.svelte'
	import {slideIndex, anottations, selectedAnottation} from '../stores/hikeShowStore'
	import ImageGalleryButton from './imageGalleryButton.svelte'

	$anottations = PATH_DATA.hike_annotations

	let hike = PATH_DATA

	const changeHandler = (index) => {
		$slideIndex = index
	}

	const nextSlide = (e) => {
		let index = $slideIndex + 1
		if (index === $anottations.length) {
			index = 0
		}
		changeHandler(index)
	}

	const prevSlide = (e) => {
		let index = $slideIndex - 1
		if (index < 0) {
			index = ($anottations.length - 1)
		}
		changeHandler(index)
	}

</script>
<style>
	.hike-show {
		display: grid;
		grid-template-columns: [first] 35% [second] 65%;
		grid-template-rows: [first] 100vh;
		overflow: hidden;
	}
	.slides {
		grid-column-start: first;
		grid-column-end: first;
		overflow: scroll;
		padding-bottom: 100vh;
		position: relative;
	}
	.map {
		grid-column-start: second;
	}

	.box {
		margin-left: 2%;
		margin-right: 2%;
	}
	.box.active {
		border: 2px solid blue;
	}

	.controls {
		padding-top: 10px;
		position: -webkit-sticky; /* Safari */
		position: sticky;
		top: 0;
		right: 0;
		left: 0;
		padding: 10px 2%;
		background: #eaeaea;
		z-index: 10;
	}

	@media (min-width: 780px) {
		.hike-show {
			grid-template-columns: [first] 25% [second] 75%;
		}
	}

</style>
<div class="hike-show">
	<div class="slides">
		<!-- Main container -->
		<div class="controls">
			<div class="box">
				<h1 class="title is-6">Mt. Sneffels via Yankee Boy Basin</h1>
				<p class=" is-size-8">
					Distance: {Math.floor(hike.distance)} meters<br>
					Vertical Gain: {hike.vertical_gain} meters
				</p>
			</div>
			<nav class="level">
			  <!-- Left side -->
			  <div class="level-left">
			    <div class="level-item">
			      <button class="button" on:click={prevSlide}><i class="fas fa-angle-left"></i></button>&nbsp;&nbsp;
			      <button class="button" on:click={nextSlide}><i class="fas fa-angle-right"></i></button>
			    </div>
			  </div>
			  <!-- Right side -->
			  <div class="level-right">
			  </div>
			</nav>

		</div>
		{#each $anottations as annotation, i}
			<div class="box" class:active={i === $slideIndex}>
				<nav class="level">
				  <!-- Left side -->
				  <div class="level-left">
				    <div class="level-item">
				    	<p class="subtitle is-size-7">
	    	        <strong>{annotation.point.coordinates[2]}</strong> meters
	    	      </p>
				    </div>
				  </div>
				  <!-- Right side -->
				  <div class="level-right">
			  		{#if annotation.images.length > 0}
			      	<ImageGalleryButton images={annotation.images}></ImageGalleryButton>
			  		{/if}
				  </div>
				</nav>
				<p>
					{annotation.copy}
				</p>
			</div>
		{/each}
	</div>
	<div class="map" >
	  <Scene></Scene>
	</div>
</div>
