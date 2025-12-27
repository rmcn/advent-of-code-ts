import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    return simulate(input, 80).toString()
  },

  two: (input: string) => {
    return simulate(input, 256).toString()
  },
}

function simulate(input: string, days: number): bigint {
  const timers = U.ints(input)
  let timerCounts = new Array<bigint>(9).fill(0n)
  for (const fish of timers) {
    timerCounts[fish]++
  }

  for (let day = 0; day < days; day++) {
    const nextTimerCounts = new Array<bigint>(9)
    for (let i = 0; i <= 7; i++) {
      nextTimerCounts[i] = timerCounts[i + 1]
    }
    nextTimerCounts[8] = timerCounts[0]
    nextTimerCounts[6] += timerCounts[0]
    timerCounts = nextTimerCounts
  }
  const total = R.sum(timerCounts)
  return total == 0 ? 0n : total
}
