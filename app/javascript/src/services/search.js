import { get } from './request'

const BASE_URL = '/search.json'

const defaultOptions = {
  distance: 100,
  results: 10
}

const setParams = (options) => {
  return [
    BASE_URL,
    `?lat=${options.point.coordinates[1]}`,
    `&lon=${options.point.coordinates[0]}`,
    `&distance=${options.distance}`,
    `&results=${options.results}`
  ].join('')
}

const findFeatures = async (options) => {
  if (!('point' in options)) throw new Error('Please provide a geoJSON point')
  const opts = {
    ...defaultOptions,
    ...options
  }
  const url = setParams(opts)
  const results = await get(url)
  return results
}

export { findFeatures }
