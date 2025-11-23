import { Solution } from '../solution.ts'
import { A } from '@mobily/ts-belt'

export default <Solution> {
  one: (input: string) => {
    const ints = input.split('\n').map((s) => s.trim()).filter((s) => s != '')
      .map((s) => Number(s))

    const pairs = A.zip(ints, ints.slice(1))

    return pairs.filter(([a, b]) => b > a).length
  },

  two: (input: string) => {
    const ints = input.split('\n').map((s) => s.trim()).filter((s) => s != '')
      .map((s) => Number(s))

    const trips = A.zipWith(
      A.zipWith(ints, ints.slice(1), (a, b) => a + b),
      ints.slice(2),
      (ab, c) => ab + c,
    )

    const pairs = A.zip(trips, trips.slice(1))

    return pairs.filter(([a, b]) => b > a).length
  },
}
