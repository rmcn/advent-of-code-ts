import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'
import { Cell, Grid } from '../grid.ts'

export default <Solution> {
  one: (input: string) => {
    const g = new Grid(input, '.')
    const accessible = g.cells().filter((c) =>
      c.v == '@' && neighbourCount(g, c, '@') < 4
    )
    //console.log(accessible)
    return accessible.length
  },

  two: (input: string) => {
    const g = new Grid(input, '.')
    let t = 0
    while (true) {
      const accessible = g.cells().filter((c) =>
        c.v == '@' && neighbourCount(g, c, '@') < 4
      )

      if (accessible.length == 0) break

      t += accessible.length

      accessible.forEach((c) => c.v = '.')
    }

    return t
  },
}

function neighbourCount(g: Grid, c: Cell, v: string): number {
  let n = 0
  if (g.get(c.p.x - 1, c.p.y - 1) == v) n++
  if (g.get(c.p.x + 0, c.p.y - 1) == v) n++
  if (g.get(c.p.x + 1, c.p.y - 1) == v) n++
  if (g.get(c.p.x - 1, c.p.y + 0) == v) n++
  // middle
  if (g.get(c.p.x + 1, c.p.y + 0) == v) n++
  if (g.get(c.p.x - 1, c.p.y + 1) == v) n++
  if (g.get(c.p.x + 0, c.p.y + 1) == v) n++
  if (g.get(c.p.x + 1, c.p.y + 1) == v) n++
  return n
}
