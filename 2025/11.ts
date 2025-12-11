import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

type State = { count: number }

export default <Solution> {
  one: (input: string) => {
    const g: Map<string, string[]> = new Map()

    for (const line of U.lines(input)) {
      const parts = line.split(': ')
      g.set(parts[0], parts[1].split(' '))
    }

    const state: State = { count: 0 }
    const visited: Map<string, boolean> = new Map()

    dfs(g, 'you', 'out', visited, state)

    return state.count
  },

  two: (input: string) => {
    const g: Map<string, string[]> = new Map()

    for (const line of U.lines(input)) {
      const parts = line.split(': ')
      g.set(parts[0], parts[1].split(' '))
    }

    const incomming: Map<string, Set<string>> = new Map()
    const allValues = g.values().flatMap((v, i) => v).toArray()
    const allKeys = g.keys().toArray()
    for (const n of R.unique(allKeys.concat(allValues))) {
      incomming.set(n, new Set())
    }
    for (const n of g.keys()) {
      for (const m of g.get(n)!) {
        incomming.get(m)!.add(n)
      }
    }

    // console.log(incomming)

    const topoOrder: string[] = []
    const s: string[] = ['svr']

    while (s.length) {
      const n = s.shift()!

      topoOrder.push(n)

      for (const m of g.get(n) ?? []) {
        if (!incomming.get(m)!.has(n)) {
          continue
        }
        incomming.get(m)!.delete(n)

        if (incomming.get(m)!.size == 0) {
          s.push(m)
        }
      }
    }

    // console.log('Topo', topoOrder)

    const pathCounts: Map<string, number> = new Map()
    for (const n of topoOrder) {
      pathCounts.set(n, 0)
    }
    pathCounts.set('svr', 1)

    for (const n of topoOrder) {
      for (const m of g.get(n) ?? []) {
        pathCounts.set(m, (pathCounts.get(m) ?? 0) + (pathCounts.get(n) ?? 0))
      }
    }

    const svrToFft = countPaths('svr', 'fft', topoOrder, g)
    const svrToDac = countPaths('svr', 'dac', topoOrder, g)
    const fftToDac = countPaths('fft', 'dac', topoOrder, g)
    const dacToFft = countPaths('dac', 'fft', topoOrder, g)
    const fftToOut = countPaths('fft', 'out', topoOrder, g)
    const dacToOut = countPaths('dac', 'out', topoOrder, g)

    const dacFirst = svrToDac * dacToFft * fftToOut
    const fftFirst = svrToFft * fftToDac * dacToOut

    console.log(dacFirst, fftFirst)

    return dacFirst == 0 ? fftFirst : dacFirst
  },
}

function countPaths(
  from: string,
  to: string,
  topoOrder: string[],
  g: Map<string, string[]>,
): number {
  const pathCounts: Map<string, number> = new Map()
  for (const n of topoOrder) {
    pathCounts.set(n, 0)
  }
  pathCounts.set(from, 1)

  for (const n of topoOrder) {
    for (const m of g.get(n) ?? []) {
      pathCounts.set(m, (pathCounts.get(m) ?? 0) + (pathCounts.get(n) ?? 0))
    }
  }

  const result = pathCounts.get(to) ?? -1

  console.log('Count', from, to, result)

  return result
}

function dfs(
  g: Map<string, string[]>,
  node: string,
  goal: string,
  visited: Map<string, boolean>,
  state: State,
) {
  if (node == goal) {
    state.count++
    return
  }

  visited.set(node, true)

  if (g.has(node)) {
    for (const next of g.get(node)!) {
      if (!visited.get(next)) {
        dfs(g, next, goal, visited, state)
      }
    }
  }

  visited.set(node, false)
}
