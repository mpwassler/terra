<script>
  import RouteMap from './routeMap.svelte'
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

<a id="description_add" class="button">Add Description</a>
