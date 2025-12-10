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

function applyCombo(
  state: number[],
  combo: number[],
  buttons: { i: number; b: number[] }[],
) {
  const result = state.slice()

  for (let i = 0; i < combo.length; i++) {
    const presses = combo[i]
    const button = buttons[i]

    for (const l of button.b) {
      result[l] = result[l] + presses
    }
  }
  return result
}

function countButtonsContaining(buttons: number[][], i: number): number {
  return buttons.filter((b) => b.includes(i)).length
}

function minPressesForJoltages(m: Machine): number {
  console.log('Solving for ', m.joltages)
  const initialState = R.range(0, m.joltages.length).map((_) => 0)

  const ordered = m.joltages.map((j, i) => ({ j, i })).sort((a, b) => a.j - b.j)

  let states: { s: number[]; presses: number }[] = [{
    s: initialState,
    presses: 0,
  }]

  let allButtons = m.buttons.slice()
  //console.log('All buttons', allButtons)

  for (const targetJ of ordered) {
    // buttons that increment target joltage's index
    const buttons = allButtons.map((b, i) => ({ b, i })).filter((b) =>
      b.b.includes(targetJ.i)
    ) /*
    console.log(
      'Targeting joltage',
      targetJ.j,
      'index',
      targetJ.i,
      'with buttons',
      buttons,
    )*/

    if (buttons.length == 0) {
      continue
    }
    //console.log(combos.length)

    // apply each combo to each state
    const newStates: { s: number[]; presses: number }[] = []
    for (const state of states) {
      const pressesRequired = targetJ.j - state.s[targetJ.i]
      const combos = calcCombos(buttons.length, pressesRequired)
      for (const combo of combos) {
        const newState = applyCombo(state.s, combo, buttons)
        if (isTarget(m.joltages, newState)) {
          return state.presses + pressesRequired
        }
        if (inRange(m.joltages, newState)) {
          newStates.push({
            s: newState,
            presses: state.presses + pressesRequired,
          })
        }
      }
    }

    states = newStates

    allButtons = allButtons.filter((_, i) => !buttons.find((b) => b.i == i))
    //console.log('remaining', allButtons)
  }

  const successPresses = states.filter((s) => isTarget(m.joltages, s.s)).map(
    (s) => s.presses,
  )
  return Math.min(...successPresses)
}

function inRange(joltages: number[], state: number[]): boolean {
  for (let i = 0; i < joltages.length; i++) {
    if (state[i] > joltages[i]) {
      return false
    }
  }
  return true
}

function isTarget(joltages: number[], state: number[]): boolean {
  for (let i = 0; i < joltages.length; i++) {
    if (state[i] != joltages[i]) {
      return false
    }
  }
  return true
}

function calcCombos(c: number, n: number): number[][] {
  switch (c) {
    case 1:
      return [[n]]
    case 2:
      return combos2(n)
    case 3:
      return combos3(n)
    case 4:
      return combos4(n)
    case 5:
      return combos5(n)
    default:
      throw new Error(`Can't combo ${c}`)
  }
}

function combos2(n: number): number[][] {
  const results: number[][] = []
  for (let i = 0; i <= n; i++) {
    const remainder = n - i
    results.push([i, remainder])
  }
  return results
}

function combos3(n: number): number[][] {
  const results: number[][] = []
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const remainder = n - i - j
      if (remainder >= 0) {
        results.push([i, j, remainder])
      }
    }
  }
  return results
}

function combos4(n: number): number[][] {
  const results: number[][] = []
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      for (let k = 0; k <= n; k++) {
        const remainder = n - i - j - k
        if (remainder >= 0) {
          results.push([i, j, k, remainder])
        }
      }
    }
  }
  return results
}

function combos5(n: number): number[][] {
  const results: number[][] = []
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      for (let k = 0; k <= n; k++) {
        for (let l = 0; l <= n; l++) {
          const remainder = n - i - j - k - l
          if (remainder >= 0) {
            results.push([i, j, k, l, remainder])
          }
        }
      }
    }
  }
  return results
}
