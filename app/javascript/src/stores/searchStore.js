import { writable, readable } from 'svelte/store'

export const results = writable([])

export const resultsRequest = writable(null)