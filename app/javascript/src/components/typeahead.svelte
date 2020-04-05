<script>
	import autocomplete from 'autocompleter'
	import { onMount } from 'svelte'

	let searchElement

	let inputText = ''

	export let data = [
	    { label: 'United Kingdom', value: 'UK' },
	    { label: 'United States', value: 'US' }
	]

	export let fetch = function(text, update) {
        text = text.toLowerCase()
        // you can also use AJAX requests instead of preloaded data
        var suggestions = data.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions)
    }

    export let onUpdate = (value) => {  }

    const onSelect = function(item) {
        inputText = item.label
        onUpdate(item)
    }

	onMount(() => {
		autocomplete({
		    input: searchElement,
		    fetch,
		    onSelect
		})
	})
</script>

<style>

</style>

<div class="is-relative">
	<input class="input" value={inputText} type="text" bind:this={searchElement} placeholder="Search Location">	
</div>