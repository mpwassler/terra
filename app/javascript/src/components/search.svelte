<script>
	import Geocoder from './geocoder.svelte'
	import SearchDisplay from './searchDisplay.svelte'
	import SearchMap from './searchMap.svelte'
  import Filters from './search/filters.svelte'
	import { findFeatures } from '../services/search'
	import { results, resultsRequest, searchPoint, filters } from '../stores/searchStore'

	const updateSearch = async ({ detail: { value: point }}) => {

		$searchPoint = point.coordinates
		$results = await findFeatures({ point })
	}
</script>

<style>
  .search-ui {
    position: sticky;
    top: 0;
    right: 0;
    left: 0;
  }
</style>

<div class="section">
  <div class="columns">
    <div class="column is-8">
      <div class="search-ui">
        <div class="box">
          <div class="columns">
            <div class="column is-8">
              <div class="field">
                <div class="control is-full-width">
                  <Geocoder on:location={updateSearch}></Geocoder>
                </div>
              </div>
            </div>
            <div class="column is-2">
              <div class="select">
                <select>
                  <option value="5" >  5 miles</option>
                  <option value="10" >10 miles</option>
                  <option value="20" >20 miles</option>
                  <option value="50" >50 miles</option>
                </select>
              </div>
            </div>
            <div class="column is-1">
              <Filters></Filters>
            </div>
          </div>
        </div>

    		<SearchMap on:center-update={updateSearch}></SearchMap>

      </div>
    </div>
    <div class="column">
  	 <SearchDisplay></SearchDisplay>
    </div>
  </div>
</div>


