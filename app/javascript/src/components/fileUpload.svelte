<script>
	import { upload } from '../services/request'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

	const onFile = ({ target }) => {
		const files = target.files ? [...target.files] : []		
		dispatch('uploaded', {files})				
	}
	
</script>

<style>
	
</style>

<div class="file is-boxed">
  <label class="file-label">
    <input class="file-input" type="file" on:input={onFile} multiple>
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label">
        Add Images
      </span>
    </span>
  </label>
</div>