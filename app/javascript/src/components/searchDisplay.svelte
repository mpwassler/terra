<script>
	import { results, filteredResults } from '../stores/searchStore'

</script>

{#each $filteredResults as result}
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
		      <a href="{result.link}" class="button">View</a>
		    </div>
		  </div>
		</div>
	</div>
{/each}
{#if $results.length < 1}
	<p>No results found for location.</p>
{/if}
