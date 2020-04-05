import { Map } from '../map'

const getData = () => {
  return window.PATH_DATA
}

const setup = () => {
  const element = document.querySelector('.map3d')
  if (element) {
	  const data = getData()
	  const map = new Map()
	  map.setViewport(data.path)
	  map.render()  	
  }
}

document.addEventListener('turbolinks:load', setup)
// document.addEventListener('turbolinks:render', setup)
document.addEventListener('turbolinks:before-render', () => {})