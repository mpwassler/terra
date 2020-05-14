import { writable, derived } from 'svelte/store'

export const results = writable([])

export const filters = writable({
  maxDistance: 40000,
  minDistance: 0,
  maxElevation: 15000,
  minElevation: 0
})

export const searchPoint = writable(null)

export const resultsRequest = writable(null)

export const filteredResults = derived(
  [filters, results],
  ([$filters, $results]) => {
    return $results.filter(result => {
      const iswithinDistance = () => {
        return result.distance > $filters.minDistance &&
               result.distance < $filters.maxDistance
      }

      const iswithinElevation = () => {
        return result.vertical_gain > $filters.minElevation &&
               result.vertical_gain < $filters.maxElevation
      }
      console.log(result)
      console.log(iswithinDistance())
      console.log(iswithinElevation())
      console.log($filters)

      return iswithinDistance() && iswithinElevation()
    })
  }
)
