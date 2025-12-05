import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'
import { Cell, Grid } from '../grid.ts'

function inRange(n: number, r: { s: number; e: number }) {
  return n >= r.s && n <= r.e
}

export default <Solution> {
  one: (input: string) => {
    const [rangeStrings, ids] = U.segmentOn(U.lines(input), (l) => l == '')
    const ranges = rangeStrings.map((s) => U.posInts(s)).map((r) => ({
      s: r[0],
      e: r[1],
    }))

    const fresh = ids.map((s) => parseInt(s)).filter((id) =>
      ranges.find((r) => inRange(id, r))
    )

    return fresh.length
  },

  two: (input: string) => {
    const [rangeStrings, _] = U.segmentOn(U.lines(input), (l) => l == '')
    const ranges = rangeStrings.map((s) => U.posInts(s)).map((r) => ({
      s: r[0],
      e: r[1],
      merged: false,
    }))

    let mergeCount: number
    do {
      mergeCount = 0

      for (let i = 0; i < ranges.length; i++) {
        const a = ranges[i]
        if (a.merged) continue

        for (let j = 0; j < ranges.length; j++) {
          const b = ranges[j]
          if (i == j) continue
          if (b.merged) continue

          if (inRange(a.s, b) || inRange(a.e, b)) {
            a.s = Math.min(a.s, b.s)
            a.e = Math.max(a.e, b.e)
            b.merged = true
            mergeCount++
          }
        }
      }
    } while (mergeCount > 0)

    return R.sum(ranges.filter((r) => !r.merged).map((r) => r.e - r.s + 1))
  },
}
