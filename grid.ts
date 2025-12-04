import * as U from './utls.ts'

export type P2 = { x: number; y: number }

export type Cell = { p: P2; v: string }

export class Grid {
  private _width: number = 0
  private _cells: { [xy: string]: Cell } = {}
  private _defaultVal: string = ''
  constructor(data: string, defaultVal: string) {
    const rows = U.lines(data)
    this._width = rows[0].length
    this._defaultVal = defaultVal
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[0].length; x++) {
        this._cells[`${x}:${y}`] = { p: { x, y }, v: rows[y][x] }
      }
    }
  }

  public cells(): Cell[] {
    return Object.values(this._cells)
  }

  public get(x: number, y: number): string {
    const c = this._cells[`${x}:${y}`]
    return c ? c.v : this._defaultVal
  }

  public set(x: number, y: number, v: string): void {
    const c = this._cells[`${x}:${y}`]
    c.v = v
  }
}
