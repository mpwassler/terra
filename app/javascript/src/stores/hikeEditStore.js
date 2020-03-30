import { writable } from 'svelte/store'
import * as turf from '@turf/turf'

export const hike = writable(JSON.parse(window.PATH_DATA))

export const modalOpen = writable(false)

export const pointToEdit = writable(null)