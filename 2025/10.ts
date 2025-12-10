import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const machines = U.lines(input).map(parseMachine)
    const counts = machines.map((m) => minButtonPresses(m))
    return R.sum(counts)
  },

  two: (input: string) => {
  },
}

type Machine = { target: number[]; buttons: number[][]; joltages: number[] }

function parseMachine(s: string): Machine {
  const parts = s.split(' ')
  return {
    target: parts[0].slice(1, -1).replaceAll('.', '0').replaceAll('#', '1')
      .split('').map((s) => parseInt(s)),
    buttons: parts.slice(1, -1).map((ns) => U.ints(ns)),
    joltages: U.ints(parts.at(-1)!),
  }
}

function key(s: number[]): string {
  return s.join(',')
}

function minButtonPresses(m: Machine): number {
  const seen: Map<string, number> = new Map()

  const initialState = R.range(0, m.target.length).map((_) => 0)
  const states = [initialState]
  seen.set(key(initialState), 0)

  const targetKey = key(m.target)

  while (states.length) {
    const state = states.shift()!
    const count = seen.get(key(state))!
    for (let b = 0; b < m.buttons.length; b++) {
      const next = toggle(state, m.buttons[b])

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

function toggle(state: number[], lights: number[]): number[] {
  const result = state.slice()
  for (const l of lights) {
    result[l] = result[l] == 0 ? 1 : 0
  }
  return result
}
