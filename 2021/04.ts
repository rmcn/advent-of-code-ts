import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const lines = U.lines(input)

    const chunks = U.segmentOn(lines, (l) => l.length == 0)
    const calls = U.ints(chunks[0][0])
    if (calls.length != R.unique(calls).length) {
      throw new Error('Duplicate calls')
    }
    const callsInv = R.fromEntries(calls.map((v, i) => [v, i]))

    for (let b = 1; b < chunks.length; b++) {
      const board = chunks[b].map((row) => U.ints(row))
      const rowAndCols = R.concat(board, U.transpose(board))
      console.log(rowAndCols)
    }
  },

  two: (input: string) => {
  },
}
