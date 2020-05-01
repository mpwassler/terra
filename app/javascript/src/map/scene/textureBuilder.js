import config from '../../config'
import { uniq } from 'lodash/array'

const TOKEN_PARAM = `?access_token=${window.API_TOKEN}`

const terrainTilePath = ([x, y, z]) => {
  return `${config.TERRAIN_BASE_URL}/${z}/${x}/${y}.pngraw${TOKEN_PARAM}`
}

const sataliteTilePath = ([x, y, z]) => {
  return `${config.SATALITE_BASE_URL}/${z}/${x}/${y}@2x.png${TOKEN_PARAM}`
}

export class TextureBuilder {
  constructor (tileGrid, type) {
    this.type = type
    this.grid = tileGrid
    this.loaded = 0
    this.debug = false
    this.buildCanvas()

  }

  buildCanvas () {
    this.canvas = document.createElement("canvas")
    this.canvas.height = this.grid.shape.rows * this.grid.tileSize
    this.canvas.width = this.grid.shape.columns * this.grid.tileSize
    if (this.debug) document.body.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')
  }

  layoutTiles () {
    let x = 0
    let y = 0
    let column = 1
    let row = 1
    let imagePathFunc = this.type === 'terrain' ? terrainTilePath : sataliteTilePath
    this.grid.tiles.forEach((tile, index) => {
      let url = imagePathFunc(tile)
      x = this.grid.tileSize * (column - 1 )
      y =  this.grid.tileSize * (row - 1)
      this.loadAndDrawImage(url, x, y)
      column += 1
      if (column > this.grid.shape.columns) {
        column = 1
        row += 1
      }
    })
  }

  loadAndDrawImage (url, x, y) {
    var image = new Image()
    image.crossOrigin = "Anonymous"
    image.onload = () => {
      this.loaded += 1
      this.context.drawImage(image, x, y, 256, 256)
      if(this.loaded === this.grid.tiles.length) {
        this.imagesLoaded()
      }
    }
    image.src = url
  }

  imagesLoaded () {
    var event = new Event('data-loaded')
    this.canvas.dispatchEvent(event)
  }

  process () {
    this.layoutTiles()
    return new Promise((resolve, reject) => {
      this.canvas.addEventListener('data-loaded', () => {
        resolve(this)
      })
    })
  }

  prefetch () {
    let imagePathFunc = this.type === 'terrain' ? terrainTilePath : sataliteTilePath
    this.tiles.forEach(tile => {
      var image = new Image()
      image.src = imagePathFunc(tile)
    })
  }

  async pixelData () {
    await this.process()
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }
}
