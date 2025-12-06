import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const lines = U.lines(input)
    const numbersInRows = lines.slice(0, -1).map((s) => U.ints(s))
    const numbersInCols = U.transpose(numbersInRows)
    const ops = lines.slice(-1)[0].trim().split(/ +/)

    const answers = calculate(numbersInCols, ops)

    //console.log(numbersInCols, ops, answers)

    return R.sum(answers)
  },

  two: (input: string) => {
    const lines = U.lines(input)
    const numberList = U.transposeStrings(lines.slice(0, -1))
    const numbers = U.segmentOn(numberList, (s) => s.trim() == '').map((ns) =>
      U.ints(ns.join(' '))
    )
    const ops = lines.slice(-1)[0].trim().split(/ +/)

    const answers = calculate(numbers, ops)

    //console.log(numberList, numbers, ops, answers)

    return R.sum(answers)
  },
}

function calculate(numbers: number[][], ops: string[]) {
  return numbers.map((nums, i) => {
    switch (ops[i]) {
      case '+':
        return R.sum(nums)
      case '*':
        return R.product(nums)
      default:
        throw new Error(`Unknown op ${ops[i]}`)
    }
  })
}
