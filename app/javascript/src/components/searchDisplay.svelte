<script>
	import { results } from '../stores/searchStore'

</script>
{#if $results && $results.length > 0}
	
	{#each $results as result}
		<div class="box">
			<div class="card">
			  <div class="card-image">
			    <figure class="image ">
			      <img src="//via.placeholder.com/1280x450" alt="Placeholder image">
			    </figure>
			  </div>
			  <div class="card-content">
			    <div class="content">
			      Distance: {result.distance}
			      <br>
			      Vertical gain: {result.vertical_gain}
			      <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
			    </div>
			  </div>
			</div>
		</div>
	{/each}
{/if}