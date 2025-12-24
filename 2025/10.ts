import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const machines = U.lines(input).map(parseMachine)
    const counts = machines.map((m) => minPressesForLights(m))
    return R.sum(counts)
  },

  two: (input: string) => {
    const machines = U.lines(input).map(parseMachine)
    const counts = machines.map((m) => minPressesForJoltages(m))
    return R.sum(counts)
  },
}

type Machine = { lights: number[]; buttons: number[][]; joltages: number[] }

function parseMachine(s: string): Machine {
  const parts = s.split(' ')
  return {
    lights: parts[0].slice(1, -1).replaceAll('.', '0').replaceAll('#', '1')
      .split('').map((s) => parseInt(s)),
    buttons: parts.slice(1, -1).map((ns) => U.ints(ns)),
    joltages: U.ints(parts.at(-1)!),
  }
}

function key(s: number[]): string {
  return s.join(',')
}

function minPressesForLights(m: Machine): number {
  const seen: Map<string, number> = new Map()

  const initialState = R.range(0, m.lights.length).map((_) => 0)
  const states = [initialState]
  seen.set(key(initialState), 0)

  const targetKey = key(m.lights)

  while (states.length) {
    const state = states.shift()!
    const count = seen.get(key(state))!
    for (let b = 0; b < m.buttons.length; b++) {
      const next = toggleLights(state, m.buttons[b])

      const nextKey = key(next)
      if (nextKey == targetKey) {
        return count + 1
      }

      if (seen.has(nextKey)) {
        continue
      }

      seen.set(nextKey, count + 1)
      states.push(next)
    }
  }
  return -1
}

function toggleLights(state: number[], indexes: number[]): number[] {
  const result = state.slice()
  for (const l of indexes) {
    result[l] = result[l] == 0 ? 1 : 0
  }
  return result
}

function minPressesForJoltages(m: Machine): number {
  const matrix: number[][] = []

  m.joltages.forEach((j, ji) => {
    const row: number[] = []
    m.buttons.forEach((jList) => {
      row.push(jList.includes(ji) ? 1 : 0)
    })
    row.push(j)
    matrix.push(row)
  })

  const maxPresses = R.sum(m.joltages)

  //console.log(matrix.map((r) => r.join(', ')))

  const rowEchForm = gaussianElimination(matrix)
  //console.log(rowEchForm.map((r) => r.join(', ')))

  integerize(rowEchForm)
  //console.log(rowEchForm.map((r) => r.join(', ')))

  const sols = backSub(rowEchForm, maxPresses)
  const validSols = sols.filter((s) => testSol(m, s))

  //console.log('Solutions', sols)
  validSols.sort((a, b) => R.sum(a) - R.sum(b))
  const counts = validSols.map((s) => R.sum(s))
  //console.log('Counts', counts)

  const minCount = Math.min(...counts)
  const maxCount = Math.max(...counts)

  console.log(minCount, testSol(m, validSols[0]) ? '' : 'INVALID')
  return minCount
}

/** Transform an augmented matrix into row echelon form using gaussian elimination */
function gaussianElimination(augmentedMatrix: number[][]): number[][] {
  // Deep clone
  const m = augmentedMatrix.slice()
  m.forEach((row, i) => m[i] = row.slice())

  //console.log('Start', m.map((r) => r.join(', ')))

  let pr = 0
  let pc = 0
  // for each column (except augment col at end), and handling shortage of rows
  while (pc < m[0].length - 1 && pr < m.length) {
    const bestRow = largestNonZero(m, pr, pc)

    //console.log(`pivot r`, pr, 'c', pc, 'best row', bestRow)

    if (bestRow == -1) {
      pc += 1
      continue
    }

    // swap best row into pivot row
    if (pr != bestRow) {
      ;[m[pr], m[bestRow]] = [m[bestRow], m[pr]]
    }

    //console.log('Swapped', m.map((r) => r.join(', ')))

    // for each row below the pivot subtract multiple of pivot to zero col p
    for (let r = pr + 1; r < m.length; r++) {
      const f = m[r][pc] / m[pr][pc]
      for (let c = pc; c < m[0].length; c++) {
        m[r][c] = m[r][c] - m[pr][c] * f
      }
    }

    pc += 1
    pr += 1
    //console.log('Applied', m.map((r) => r.join(', ')))
  }

  return m
}

function largestNonZero(m: number[][], pr: number, pc: number) {
  let maxRow = -1
  let maxValue = 0
  for (let r = pr; r < m.length; r++) {
    if (m[r][pc] != 0 && Math.abs(m[r][pc]) > maxValue) {
      maxRow = r
      maxValue = Math.abs(m[r][pc])
    }
  }

  return maxRow
}

function backSub(m: number[][], maxPresses: number): number[][] {
  const sols: number[][] = []
  const sol: number[] = Array(m[0].length - 1)
  backSubRow(m, m.length - 1, sol, 0, sols, maxPresses)
  return sols
}

function backSubRow(
  m: number[][],
  r: number,
  sol: number[],
  solCount: number,
  sols: number[][],
  maxPresses: number,
) {
  if (r < 0) {
    sols.push(sol)
    return
  }

  const row = m[r]

  // Skip zero columns
  let c = 0
  for (c = 0; c < row.length - 1 - solCount; c++) {
    if (row[c] != 0) {
      break
    }
  }

  const unknownCount = row.length - 1 - solCount - c

  //console.log('Unknown', unknownCount, c, sol)

  if (unknownCount == 1) {
    const knownTotal: number = sumKnown(row, sol, solCount)
    const solVal = round((row.at(-1)! - knownTotal) / row[c], 5)

    if (solVal < 0) {
      return
    }

    if (!isInteger(solVal)) {
      return
    }

    sol[sol.length - 1 - solCount] = solVal
    backSubRow(m, r - 1, sol, solCount + 1, sols, maxPresses)
  } else if (unknownCount == 0) {
    // nowt to do
    backSubRow(m, r - 1, sol, solCount, sols, maxPresses)
  } else if (unknownCount >= 2) {
    // one free var, try several values from 0 onwards, stop when too big?
    for (let solVal = 0; solVal <= maxPresses; solVal++) {
      sol[sol.length - 1 - solCount] = solVal
      backSubRow(m, r, sol.slice(), solCount + 1, sols, maxPresses)
    }
  } else {
    throw new Error(`Unsuppored ${unknownCount}`)
  }
}

function sumKnown(row: number[], sol: number[], solCount: number): number {
  let t = 0
  for (let i = sol.length - solCount; i < sol.length; i++) {
    t += row[i] * sol[i]
  }
  return t
}

function isInteger(solVal: number): boolean {
  return Number.isInteger(round(solVal, 5))
}

function round(n: number, decimalPlaces: number) {
  const factor = Math.pow(10, decimalPlaces)
  return Math.round((n + Number.EPSILON) * factor) / factor
}

function integerize(m: number[][]) {
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      m[r][c] = round(120.0 * m[r][c], 5)
    }
  }
}

function testSol(m: Machine, presses: number[]): boolean {
  const actualJs: number[] = Array(m.joltages.length).fill(0)

  for (let i = 0; i < m.buttons.length; i++) {
    for (let j = 0; j < m.buttons[i].length; j++) {
      actualJs[m.buttons[i][j]] += presses[i]
    }
  }

  //console.log(actualJs, m.joltages)

  return arraysEqual(actualJs, m.joltages)
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length != b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      return false
    }
  }
  return true
}
