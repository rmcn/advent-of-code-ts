import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'
import { MapCount } from '../utils/MapCount.ts'

export default <Solution> {
  one: (input: string) => {
    const lines = parse(input)
    const aligned = lines.filter((l) => isHorz(l) || isVert(l))
    return countIntersections(aligned)
  },

  two: (input: string) => {
    const lines = parse(input)
    return countIntersections(lines)
  },
}

type Line = { x1: number; y1: number; x2: number; y2: number }

function countIntersections(lines: Line[]) {
  const counts = new MapCount<string>()

  for (const line of lines) {
    for (const p of pointsOnLine(line)) {
      counts.add(p)
    }
  }

  return counts.keys((c) => c > 1).length
}

function parse(input: string) {
  return U.lines(input).map((l) => {
    const [x1, y1, x2, y2] = U.ints(l)
    return { x1, y1, x2, y2 }
  })
}

const isVert = (l: Line) => l.x1 == l.x2
const isHorz = (l: Line) => l.y1 == l.y2

function pointsOnLine(a: Line): string[] {
  if (isVert(a)) {
    const ys = Math.min(a.y1, a.y2)
    const ye = Math.max(a.y1, a.y2)
    return R.range(ys, ye + 1).map((y) => `${a.x1},${y}`)
  } else if (isHorz(a)) {
    const xs = Math.min(a.x1, a.x2)
    const xe = Math.max(a.x1, a.x2)
    return R.range(xs, xe + 1).map((x) => `${x},${a.y1}`)
  } else {
    const dx = Math.sign(a.x2 - a.x1)
    const dy = Math.sign(a.y2 - a.y1)
    const s = Math.abs(a.x1 - a.x2)
    return R.range(0, s + 1).map((i) => `${a.x1 + dx * i},${a.y1 + dy * i}`)
  }
}
