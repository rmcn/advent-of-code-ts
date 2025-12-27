import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    return minTotalCost(input, costOne)
  },

  two: (input: string) => {
    return minTotalCost(input, costTwo)
  },
}

function minTotalCost(input: string, cost: (steps: number) => number) {
  const positions = U.ints(input)
  const targets = R.range(0, U.max(positions) + 1)
  const totalCosts = targets.map((t) =>
    R.sum(positions.map((p) => cost(Math.abs(p - t))))
  )
  return U.min(totalCosts)
}

function costOne(steps: number): number {
  return steps
}

function costTwo(steps: number): number {
  return steps == 0 ? 0 : steps * (steps + 1) / 2
}
