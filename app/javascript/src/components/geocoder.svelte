<script>
	import { createEventDispatcher } from 'svelte'
	import Typeahead from './typeahead.svelte'
	import { get } from '../services/request'
	import { debounce } from 'lodash/function'

	const dispatch = createEventDispatcher()

	const searchUrl = (search) => {
		const types = ['poi', 'place', 'neighborhood'].join(',')
		const base = 'https://api.mapbox.com/geocoding/v5/mapbox.places'
		return `${base}/${search}.json?types=${types}&access_token=${window.API_TOKEN}`
	}

	export let data = []

	const onUpdate = async (text, update) => {
		text = text.toLowerCase()
		// you can also use AJAX requests instead of preloaded data
		const results = await get(searchUrl(text))
		const items = results.features.map(feature => ({
			value: feature.geometry,
			label: feature.place_name
		}))
		update(items)
	}

	const throttledUpdate = debounce(onUpdate, 500)

	const onValueChaged = (newValue) => {
		dispatch('location', newValue)
	}
</script>

<Typeahead {data} fetch={throttledUpdate} onUpdate={onValueChaged}></Typeahead>