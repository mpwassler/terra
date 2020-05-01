import config from '../../config'
import { uniq } from 'lodash/array'

export class TileGrid {
  constructor (opts) {
    this.tiles = opts.tiles
    this.tileSize = 256
    this.rows    = uniq(this.tiles.map(([x,y,z]) => y)).length
    this.columns = uniq(this.tiles.map(([x,y,z]) => x)).length
    this.z = this.tiles[0][2]
    this.sortTiles()
    this.setDetails()
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

  setDetails () {
    this.shape  = { rows: this.rows, columns: this.columns }
    this.width  = this.columns * this.tileSize,
    this.height = this.rows * this.tileSize,
    this.start  = this.tiles[0]

  }
}
