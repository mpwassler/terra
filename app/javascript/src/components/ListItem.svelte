<script>
  import FileUpload from './fileUpload.svelte'
  import { upload } from '../services/request'
  export let annotation

  const saveImages = async ({detail: { files }}) => {
    let response = await upload(`/hike_annotations/${annotation.id}/images`, files)
    
  }

</script>
<style>
  .image {
    margin: 10px;
  }
</style>
<div class="box">
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          {annotation.copy}
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-large">Edit</span>
          </a>
          <a class="level-item">
            <span class="icon is-large">Delete</span>
          </a>          
        </div>
      </nav>
    </div>
    <div class="media-right">
      <FileUpload on:uploaded={saveImages}></FileUpload>
    </div>
  </article>
</div>
{#if annotation.images}
  {#each annotation.images as image}
    <div class=" image box is-inline-block">
      <img src="{image.thumbnail_path}" width="125">
    </div>
  {/each}
{/if}