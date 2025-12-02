import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const invalidIds = allIds(input)
      .filter((n) => {
        const s = n.toString()
        const h = s.length / 2
        return s.length % 2 == 0 && s.substring(0, h) == s.substring(h)
      })
    return R.sum(invalidIds)
  },

  two: (input: string) => {
    const invalidIds = allIds(input)
      .filter((n) => {
        const s = n.toString()
        for (let partLength = 1; partLength <= s.length / 2; partLength++) {
          if (s.length % partLength == 0) {
            const part = s.substring(0, partLength)
            if (part.repeat(s.length / partLength) == s) {
              return true
            }
          }
        }
        return false
      })
    return R.sum(invalidIds)
  },
}

function allIds(input: string) {
  return input.trim().split(',').map((r) => U.posInts(r))
    .flatMap((r) => R.range(r[0], r[1] + 1))
}
