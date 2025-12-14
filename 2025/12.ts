import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const areas = [5, 7, 6, 7, 7, 7]
    const lines = U.lines(input)
    const regions = U.segmentOn(lines, (l) => l == '').slice(-1)[0].map(
      parseRegion,
    )

    const margins: number[] = []
    for (const r of regions) {
      const area = r.w * r.h
      const shapes = R.sum(r.counts.map((c, i) => c * areas[i]))
      const margin = area - shapes
      margins.push(margin)
      //console.log(margin)
    }

    margins.sort((a, b) => a - b)
    return margins.filter((m) => m >= 0).length

    //console.log(margins.join('\n'))
  },

  two: (input: string) => {
  },
}

function parseRegion(s: string) {
  const [w, h, ...counts] = U.ints(s)
  return { w, h, counts }
}
