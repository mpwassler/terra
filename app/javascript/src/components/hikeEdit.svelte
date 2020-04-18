<script>
  import RouteMap from './routeMap.svelte'
  import Modal from './modal.svelte'
  import ListItem from './ListItem.svelte'
  import { pointToEdit, hike } from '../stores/hikeEditStore'
  import { post, get } from '../services/request'
 

  let hikeAnnotationResponse

  const saveHikeAnnotation = () => {  
  	hikeAnnotationResponse = post( window.links.hikeAnnotationsPath, {
  		...$pointToEdit, 
  		hike_id: $hike.id
  	}).then(() => {
  		return new Promise( async (resolve, reject) => {
  			const data = await get(`${window.links.show}.json`)
  			$hike = data
  			$pointToEdit = null
  			resolve()
  		})
  	})
  }

</script>

<style>
  h1 {
    color: #FF3E00;
  }
</style>

<div class="field">    
	<label for="hike_name">Name</label>
	<input class="input" type="text" value="" name="hike[name]" id="hike_name">
</div>
<RouteMap></RouteMap>

<Modal open={!!$pointToEdit} title="Add a description" on:accept={saveHikeAnnotation} >
	{#if hikeAnnotationResponse===undefined}
    	<p></p>
    {:else}
	    {#await hikeAnnotationResponse}
	    	<p>Loading...</p>
	    {:catch error}
	    	<div class="notification is-danger">
	    		There was a problem with the request
	    	</div>
	    {/await}
    {/if}
	<div class="field">
	  <span>Elevation: {$pointToEdit.geojson.geometry.coordinates[2]}</span>
	  <div class="control">
	    <textarea bind:value={$pointToEdit.copy} class="textarea is-primary" placeholder="Primary textarea"></textarea>
	  </div>	  
	</div>
</Modal>


{#each $hike.hike_annotations as annotation}
	<ListItem {annotation}></ListItem>
{/each}

<a id="description_add" class="button">Add Description</a>
