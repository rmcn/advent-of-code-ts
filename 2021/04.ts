import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const { calls, boards } = parse(input)
    const callsInv = R.fromEntries(calls.map((v, i) => [v, i]))

    let winCallIndex = calls.length
    let winBoardIndex = -1
    for (let i = 0; i < boards.length; i++) {
      const callIndex = firstLineCallIndex(boards[i], callsInv)

      if (callIndex < winCallIndex) {
        winCallIndex = callIndex
        winBoardIndex = i
      }
    }

    const unmarked = R.flatMap(boards[winBoardIndex], (b) => b).filter((v) =>
      callsInv[v] > winCallIndex
    )
    const unmarkedSum = R.sum(unmarked)

    return unmarkedSum * calls[winCallIndex]
  },

  two: (input: string) => {
    const { calls, boards } = parse(input)
    const callsInv = R.fromEntries(calls.map((v, i) => [v, i]))

    let winCallIndex = -1
    let winBoardIndex = -1
    for (let i = 0; i < boards.length; i++) {
      const callIndex = firstLineCallIndex(boards[i], callsInv)

      if (callIndex > winCallIndex) {
        winCallIndex = callIndex
        winBoardIndex = i
      }
    }

    const unmarked = R.flatMap(boards[winBoardIndex], (b) => b).filter((v) =>
      callsInv[v] > winCallIndex
    )
    const unmarkedSum = R.sum(unmarked)

    return unmarkedSum * calls[winCallIndex]
  },
}

function parse(input: string) {
  const lines = U.lines(input)

  const chunks = U.segmentOn(lines, (l) => l.length == 0)
  const calls = U.ints(chunks[0][0])
  if (calls.length != R.unique(calls).length) {
    throw new Error('Duplicate calls')
  }

  const boards = chunks.slice(1).map((c) => c.map((row) => U.ints(row)))
  return { calls, boards }
}

function firstLineCallIndex(
  board: number[][],
  callsInv: Record<number, number>,
): number {
  const lines = board.concat(U.transpose(board))
  const linesLastCallIndex = lines.map((l) =>
    Math.max(...l.map((v) => callsInv[v]))
  )
  const result = Math.min(...linesLastCallIndex)
  return result
}
