<script>
  export let images = []
  import Caurosel from './caurosel.svelte'

  let showModel = false

  let selectedIndex = 0

  const handleClick = (event) => {
    showModel = true
  }

  const close = () => showModel = false
</script>

<style>
  .image {
    margin: 10px;
  }
</style>

<button class="button is-rounded" on:click={handleClick}><i class="fas fa-camera"></i></button>

{#if showModel}
<div class="modal is-active">
  <div class="modal-background" on:click={close}></div>
  <div class="modal-content is-clipped">
    <Caurosel adaptiveHeight={true} initialIndex={selectedIndex}>
      {#each images as image}
        <img class="carousel-cell image" src={image.path} width={image.metadata.width} height={image.metadata.height} />
      {/each}
    </Caurosel>
  </div>
  <button class="modal-close is-large" aria-label="close" on:click={close}></button>
</div>
{/if}
