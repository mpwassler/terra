<script>
  export let title
  export let min
  export let max
  export let value
</script>

<div class="field">
  <label class="label is-size-8">{title}</label>
  <div class="control">
    <input bind:value={value} class="slider" step="1" min={min} max={max} type="range">
  </div>
</div>
