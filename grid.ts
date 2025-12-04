import * as U from './utls.ts'

export type P2 = { x: number; y: number }

export type Cell = { p: P2; v: string }

export class Grid {
  private _width: number
  private _height: number
  private _stride: number
  private _cells: { [xy: number]: Cell } = {}
  private _defaultVal: string = ''
  constructor(data: string, defaultVal: string) {
    const rows = U.lines(data)
    this._height = rows.length
    this._width = rows[0].length
    this._stride = this._width + 2 // +2 to allow out of bounds
    this._defaultVal = defaultVal
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[0].length; x++) {
        this._cells[x + y * this._stride] = { p: { x, y }, v: rows[y][x] }
      }
    }
  }

  public cells(): Cell[] {
    return Object.values(this._cells)
  }

  private checkBounds(x: number, y: number) {
    if (x < -1 || x > this._width || y < -1 || y > this._height) {
      throw new Error(`Out of bounds x:${x}, y: ${y}`)
    }
  }

  public get(x: number, y: number): string {
    this.checkBounds(x, y)
    const c = this._cells[x + y * this._stride]
    return c ? c.v : this._defaultVal
  }

  public set(x: number, y: number, v: string): void {
    this.checkBounds(x, y)
    this._cells[x + y * this._stride].v = v
  }
}
