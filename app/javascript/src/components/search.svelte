<script>
	import Geocoder from './geocoder.svelte'
	import SearchDisplay from './searchDisplay.svelte'
	import SearchMap from './searchMap.svelte'
	import { findFeatures } from '../services/search'
	import { results, resultsRequest, searchPoint } from '../stores/searchStore'
	
	const updateSearch = async ({ detail: { value: point }}) => {
		$searchPoint = point.coordinates
		$results = await findFeatures({ point })
	}

	
</script>

<div class="tabs is-medium">
  <ul>
    <li class="is-active"><a>List</a></li>
    <li><a>Map</a></li>	    
  </ul>
</div>

<div class="box">
	<div class="columns">	
	<div class="column is-10">		
		<div class="field">
		  <div class="control is-full-width">
		    <Geocoder on:location={updateSearch}></Geocoder>
		  </div>
		</div>
	</div>
	<div class="column is-2">
		<div class="select">
		  <select>
		    <option value="5" >  5 miles</option>
		    <option value="10" >10 miles</option>
		    <option value="20" >20 miles</option>
		    <option value="50" >50 miles</option>
		  </select>
		</div>		
	</div>
	</div>
</div>


<div class="columns">
  <div class="column">  	
	<SearchDisplay></SearchDisplay>  	
  </div>
  <div class="column is-8">
  	{#if $searchPoint}
  		<SearchMap></SearchMap>
  	{/if}
  </div>
</div>
