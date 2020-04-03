import { Map } from '../src/map'

const getData = () => {
  return JSON.parse(window.PATH_DATA)
}

const main = () => {
  const data = getData()
  const map = new Map()
  map.setViewport(data.path)
  map.render()
}

main()
