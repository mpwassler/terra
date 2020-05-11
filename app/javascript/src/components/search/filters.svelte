<script>
  import Slider from '../forms/slider.svelte'
  import { filters } from '../../stores/searchStore'

  let isOpen = false

</script>

<style></style>

<div class="dropdown is-right" class:is-active={isOpen}>
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu7" on:click={(e) => isOpen = !isOpen}>
      <span class="icon is-small">
        <i class="fas fa-filter"></i>
      </span>
      <span> Filters</span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu7" role="menu">
    <div class="dropdown-content">
      <div class="dropdown-item">
        <Slider bind:value={$filters.minDistance}  title="Min Distance"       min={0} max={40000} />
        <Slider bind:value={$filters.maxDistance}  title="Max Distance"       min={0} max={40000} />
        <Slider bind:value={$filters.minElevation} title="Min Elevation Gain" min={0} max={15000} />
        <Slider bind:value={$filters.maxElevation} title="Max Elevation Gain" min={0} max={15000} />
        <button on:click={(e) => isOpen = false} class="button">Apply</button>
      </div>
    </div>
  </div>
</div>
