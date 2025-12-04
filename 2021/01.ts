import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const ints = U.lines(input).map((s) => Number(s))

    const pairs = R.zip(ints, ints.slice(1))

    return pairs.filter(([a, b]) => b > a).length
  },

  two: (input: string) => {
    const ints = U.lines(input).map((s) => Number(s))

    const trips = R.zipWith(
      R.zipWith(ints, ints.slice(1), (a, b) => a + b),
      ints.slice(2),
      (ab, c) => ab + c,
    )

    const pairs = R.zip(trips, trips.slice(1))

    return pairs.filter(([a, b]) => b > a).length
  },
}
