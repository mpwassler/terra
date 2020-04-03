<script>
  import { createEventDispatcher } from 'svelte'

  export let open
  
  export let title = ''

  const dispatch = createEventDispatcher()

  const close = () => {  	
  	open = false
  }

  const accept = () => {  	
  	dispatch('accept')
  }
</script>

<style>
  
</style>

{#if open}
	<div class="modal is-active">
	  <div class="modal-background"></div>
	  <div class="modal-card">
	    <header class="modal-card-head">
	      <p class="modal-card-title">{title}</p>
	      <button class="delete" aria-label="close" on:click={close}></button>
	    </header>
	    <section class="modal-card-body">
	      <slot></slot>
	    </section>
	    <footer class="modal-card-foot">
	      <button class="button is-success" on:click={accept}>Save changes</button>
	      <button class="button" on:click={close}>Cancel</button>
	    </footer>
	  </div>
	</div>
{/if}