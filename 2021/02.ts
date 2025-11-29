import { Solution } from '../solution.ts'
import * as R from 'remeda'
import { int, lines, sum } from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const groups = R.groupBy(lines(input), (l) => l.split(' ')[0])
    const sums = R.mapValues(groups, (values) => sum(values.map((s) => int(s))))
    return sums.forward * (sums.down - sums.up)
  },

  two: (input: string) => {
    let aim = 0
    let depth = 0
    let x = 0
    lines(input).forEach((line) => {
      const v = int(line)
      switch (line[0]) {
        case 'd':
          aim += v
          break
        case 'u':
          aim -= v
          break
        case 'f':
          x += v
          depth += aim * v
          break
      }
    })
    return x * depth
  },
}
