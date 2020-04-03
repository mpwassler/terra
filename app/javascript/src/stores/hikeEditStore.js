import { writable, readable } from 'svelte/store'
import * as turf from '@turf/turf'

const hikeData = window.PATH_DATA
export const hike = writable(hikeData)

export const modalOpen = writable(false)

export const pointToEdit = writable(null)