import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const points: P2[] = U.lines(input).map((l) => U.ints(l)).map((p) => ({
      x: p[0],
      y: p[1],
    }))
    const rects = calcRects(points).sort((a, b) => b.area - a.area)
    return rects[0].area
  },

  two: (input: string) => {
    const points: P2[] = U.lines(input).map((l) => U.ints(l)).map((p) => ({
      x: p[0],
      y: p[1],
    }))
    const rects = calcRects(points).sort((a, b) => b.area - a.area)

    for (const rect of rects) {
      if (isInside(points, rect)) {
        return rect.area
      }
    }
  },
}

type P2 = { x: number; y: number }
type P2Pair = { a: P2; b: P2; area: number }

function calcRects(points: P2[]): P2Pair[] {
  const areas = []
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    for (let j = i; j < points.length; j++) {
      const b = points[j]
      const area = (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1)
      areas.push({ a, b, area })
    }
  }
  return areas
}

function isInside(points: P2[], rect: P2Pair): boolean {
  return true
}
