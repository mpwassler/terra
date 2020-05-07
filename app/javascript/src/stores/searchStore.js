import { writable } from 'svelte/store'

export const results = writable([])

export const filters = writable({
  maxDistance: 25,
  minDistance: 0,
  maxElevation: 10000,
  minElevation: 0,
})

export const searchPoint = writable(null)

export const resultsRequest = writable(null)
