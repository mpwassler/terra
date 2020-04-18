<script>
  import { onMount, setContext } from 'svelte'
  import Flickity from 'flickity'

  let flkty
  let elem

  export let adaptiveHeight = false

  export let initialIndex = 0

  export let changeHandler = (index) => {}

  onMount(() => {
  	flkty = new Flickity( elem, {
  	  // options
  	  cellAlign: 'left',
  	  cellSelector: '.carousel-cell',
      prevNextButtons: false,
      adaptiveHeight,
      initialIndex
  	})

    flkty.on( 'change', changeHandler )
  })
</script>

<div class="slider" bind:this={elem}>
	<slot></slot>
</div>
