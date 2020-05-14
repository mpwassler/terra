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

  const token = document.querySelector('meta[name="csrf-token"]').content

</script>

<style>
  h1 {
    color: #FF3E00;
  }

  .save {
    float: right;
  }
</style>
<div class="section">
  <form enctype="multipart/form-data" accept-charset="UTF-8" action="/hikes/{$hike.id}" method="post">
    <input name="_method" type="hidden" value="patch" />
    <input name="authenticity_token" type="hidden" value="{token}" />
    <div class="box">
      <div class="columns">
        <div class="column is-10">
            <div class="field">
            	<label for="hike_name">Name</label>
            	<input class="input" type="text" value="{$hike.name}" name="hike[name]" id="hike_name">
            </div>

            <img width="450" src="{$hike.cover_image.thumbnail_path}">
            <label for="hike_name">Add a featured image</label>
            <div class="file">
              <label class="file-label">
                <input class="file-input" type="file" name="hike[cover_image]">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a file…
                  </span>
                </span>
              </label>
            </div>


        </div>
        <div class="column is-2">
          <button class="button save">Save</button>
        </div>
      </div>
    </div>
  </form>
  <br>
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

</div>
