<script>
  import { onMount, setContext } from 'svelte'
  import Flickity from 'flickity'

  let flkty
  let elem

  export let changeHandler = (index) => {}

  onMount(() => {
  	flkty = new Flickity( elem, {
  	  // options
  	  cellAlign: 'left',
  	  cellSelector: '.carousel-cell',
      prevNextButtons: false

  	})

    flkty.on( 'change', changeHandler )
  })
</script>

<div class="slider" bind:this={elem}>
	<slot></slot>
</div>