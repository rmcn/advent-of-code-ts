import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const joltages = U.lines(input).map(max2Joltage)
    return R.sum(joltages)
  },

  two: (input: string) => {
    const joltages = U.lines(input).map(max12Joltage)
    return R.sum(joltages)
  },
}

function max2Joltage(bank: string): number {
  const one = maxDigit(bank.slice(0, -1))
  const two = maxDigit(bank.slice(one.i + 1))
  return parseInt(one.digit + two.digit)
}

function max12Joltage(bank: string): number {
  let remainder = bank
  let joltageDigits = ''
  for (let leaveAtEnd = 11; leaveAtEnd >= 0; leaveAtEnd--) {
    const next = maxDigit(
      leaveAtEnd == 0 ? remainder : remainder.slice(0, -leaveAtEnd),
    )
    joltageDigits += next.digit
    remainder = remainder.slice(next.i + 1)
  }
  return parseInt(joltageDigits)
}

function maxDigit(bank: string): { i: number; digit: string } {
  let max = '0'
  let maxIndex = -1
  for (let i = 0; i < bank.length; i++) {
    if (bank[i] > max) {
      max = bank[i]
      maxIndex = i
    }
  }
  return {
    digit: max,
    i: maxIndex,
  }
}
