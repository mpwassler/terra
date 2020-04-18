import { writable } from 'svelte/store'

export const hike = writable(null)

export const modalOpen = writable(false)

export const pointToEdit = writable(null)
