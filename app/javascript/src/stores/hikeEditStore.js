import { writable, readable } from 'svelte/store'
import * as turf from '@turf/turf'

function createHikeEditStore() {
	const { subscribe, set, update } = writable(window.PATH_DATA)

	return {
		subscribe,
		set,
		update,
		default: () => set(window.PATH_DATA)	
	}
}


export const hike = writable(null)

export const modalOpen = writable(false)

export const pointToEdit = writable(null)