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
  constructor (opts) {
    this.type = opts.type
    this.tiles = opts.tiles
    this.debug = opts.debug
    this.tileSize = 256
    this.loaded = 0
    this.rows    = uniq(this.tiles.map(([x,y,z]) => y)).length
    this.columns = uniq(this.tiles.map(([x,y,z]) => x)).length
    this.z = this.tiles[0][2]
    this.sortTiles()
    this.buildCanvas()

  }

  buildCanvas () {
    this.canvas = document.createElement("canvas")
    this.canvas.height = this.rows * this.tileSize
    this.canvas.width = this.columns * this.tileSize
    if (this.debug) document.body.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')
  }

  sortTiles () {
    let yValues = uniq(this.tiles.map(([x,y,z]) => y)).sort()
    let xValues = uniq(this.tiles.map(([x,y,z]) => x)).sort()
    let tiles = []
    for (var i = 0; i < yValues.length; i++) {
      for (var j = 0; j < xValues.length; j++) {
        tiles.push([ xValues[j], yValues[i], this.z ])
      }
    }
    this.tiles = tiles
  }

  layoutTiles () {
    let x = 0
    let y = 0
    let column = 1
    let row = 1
    let imagePathFunc = this.type === 'terrain' ? terrainTilePath : sataliteTilePath
    this.tiles.forEach((tile, index) => {
      let url = imagePathFunc(tile)
      x = this.tileSize * (column - 1 )
      y =  this.tileSize * (row - 1)
      this.loadAndDrawImage(url, x, y)
      column += 1
      if (column > this.columns) {
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
      if(this.loaded === this.tiles.length) {
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

  gridDetails () {
    return {
      shape:  [this.columns, this.rows], // x, y
      width:  this.columns * this.tileSize,
      height: this.rows * this.tileSize,
      start: this.tiles[0]
    }
  }

  pixelData () {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }
}
