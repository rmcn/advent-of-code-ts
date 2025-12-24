import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => solve(input, 'min'),
  two: (input: string) => solve(input, 'max'),
}

function solve(input: string, comp: 'min' | 'max') {
  const { calls, boards } = parse(input)
  const callsInv = R.fromEntries(calls.map((v, i) => [v, i]))

  const firstLineIndexes = boards.map((b) => firstLineCallIndex(b, callsInv))
  const bestBoardIndex = comp == 'min'
    ? U.minIndex(firstLineIndexes)
    : U.maxIndex(firstLineIndexes)
  const bestCallIndex = firstLineIndexes[bestBoardIndex]

  const unmarked = boards[bestBoardIndex].flat().filter((v) =>
    callsInv[v] > bestCallIndex
  )
  const unmarkedSum = R.sum(unmarked)

  return unmarkedSum * calls[bestCallIndex]
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
