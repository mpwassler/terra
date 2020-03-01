import { Map } from '../src/map'

const getData = () => {
  return JSON.parse(window.PATH_DATA)
}

const main = () => {
  const { path } = getData()
  const map = new Map()
  map.setViewport(path)
  map.render()
}

main()
