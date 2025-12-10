import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const points: P2[] = U.lines(input).map((l) => U.ints(l)).map((p) => ({
      x: p[0],
      y: p[1],
    }))
    const rectsByAreaDesc = calcRects(points).sort((a, b) => b.area - a.area)
    return rectsByAreaDesc[0].area
  },

  two: (input: string) => {
    const points: P2[] = U.lines(input).map((l) => U.ints(l)).map((p) => ({
      x: p[0],
      y: p[1],
    }))

    const rectsByAreaDesc = calcRects(points).sort((a, b) => b.area - a.area)

    const edges: [P2, P2][] = R.zip(points, points.slice(1))
    edges.push([
      points.at(-1)!,
      points[0],
    ])

    for (const rect of rectsByAreaDesc) {
      if (isRectInsideShape(points, edges, rect)) {
        return rect.area
      }
    }
  },
}

type P2 = { x: number; y: number }
type RectWithArea = { a: P2; b: P2; area: number }

function calcRects(points: P2[]): RectWithArea[] {
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

function isRectInsideShape(
  points: P2[],
  edges: [P2, P2][],
  rect: RectWithArea,
): boolean {
  // Graphics co-ords, origin is in top left
  // Get top-left and bottom-right co-ords of candidate rectangle, shrunk by half square
  const tl = {
    x: Math.min(rect.a.x, rect.b.x) + 0.5,
    y: Math.min(rect.a.y, rect.b.y) + 0.5,
  }
  const br = {
    x: Math.max(rect.a.x, rect.b.x) - 0.5,
    y: Math.max(rect.a.y, rect.b.y) - 0.5,
  }

  // Fast fail - check no big-shape points inside rect
  if (
    points.find((p) => p.x > tl.x && p.y > tl.y && p.x < br.x && p.y < br.y)
  ) {
    return false
  }

  const tr = { x: br.x, y: tl.y }
  const bl = { x: tl.x, y: br.y }
  const rectPoints = [tl, tr, bl, br]
  const rectEdges: [P2, P2][] = [[tl, tr], [tr, br], [br, bl], [bl, tl]]

  // check all rect points inside big-shape
  for (const rectPoint of rectPoints) {
    if (!isPointInside(rectPoint, edges)) {
      return false
    }
  }

  // check edges of rect and big shape do not intersect
  for (const rectEdge of rectEdges) {
    if (edges.find((e) => edgesIntersect(rectEdge, e))) {
      return false
    }
  }
  return true
}

// Ray-cast to determine if point is inside shape
function isPointInside(p: P2, edges: [P2, P2][]): boolean {
  const infinity = { x: p.x, y: -1 }
  const ray: [P2, P2] = [p, infinity]
  // count intersections, odd => inside, even => outside
  const intersections = edges.filter((e) => edgesIntersect(e, ray))
  return intersections.length % 2 == 1
}

function edgesIntersect([a, b]: [P2, P2], [c, d]: [P2, P2]): boolean {
  const oa = orient(c, d, a)
  const ob = orient(c, d, b)
  const oc = orient(a, b, c)
  const od = orient(a, b, d)

  return (oa * ob < 0 && oc * od < 0)
}

function orient(a: P2, b: P2, c: P2): number {
  return cross(subP2(b, a), subP2(c, a))
}

function subP2(a: P2, b: P2) {
  return { x: a.x - b.x, y: a.y - b.y }
}

function cross(a: P2, b: P2): number {
  return a.x * b.y - a.y * b.x
}
