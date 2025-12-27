import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => solve(input, 'min'),
  two: (input: string) => solve(input, 'max'),
}

function solve(input: string, comp: 'min' | 'max') {
  const lines = U.lines(input)
  const chunks = U.segmentOn(lines, (l) => l.length == 0)

  const calls = U.ints(chunks[0][0])
  const boards = chunks.slice(1).map((c) => c.map((row) => U.ints(row)))

  const callsInv = R.fromEntries(calls.map((v, i) => [v, i]))

  const firstLineIndexes = boards.map((b) => firstLineCallIndex(b, callsInv))
  const bestBoardIndex = comp == 'min'
    ? U.minIndex(firstLineIndexes)
    : U.maxIndex(firstLineIndexes)
  const bestCallIndex = firstLineIndexes[bestBoardIndex]

  const bestBoardNumbers = boards[bestBoardIndex].flat()
  const unmarked = bestBoardNumbers.filter((v) => callsInv[v] > bestCallIndex)
  const unmarkedSum = R.sum(unmarked)

  return unmarkedSum * calls[bestCallIndex]
}

function firstLineCallIndex(
  board: number[][],
  callsInv: Record<number, number>,
): number {
  const lines = board.concat(U.transpose(board))
  const maxCallIndexes = lines.map((l) => U.max(l.map((v) => callsInv[v])))
  return U.min(maxCallIndexes)
}
