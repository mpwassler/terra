import { writable, readable } from 'svelte/store'

export const results = writable([])

export const searchPoint = writable(null)

export const resultsRequest = writable(null)