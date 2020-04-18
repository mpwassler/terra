import { writable } from 'svelte/store'

export const results = writable([])

export const searchPoint = writable(null)

export const resultsRequest = writable(null)
