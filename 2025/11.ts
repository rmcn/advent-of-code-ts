import { Solution } from '../solution.ts'
import * as U from '../utls.ts'
import * as G from '../algos/graph.ts'

export default <Solution> {
  one: (input: string) => {
    const g: Map<string, string[]> = new Map()

    for (const line of U.lines(input)) {
      const parts = line.split(': ')
      g.set(parts[0], parts[1].split(' '))
    }

    let count = 0

    G.dfs(g, 'you', (node) => {
      if (node == 'out') count++
    })

    return count
  },

  two: (input: string) => {
    const g: Map<string, string[]> = new Map()

    for (const line of U.lines(input)) {
      const parts = line.split(': ')
      g.set(parts[0], parts[1].split(' '))
    }

    const topoOrder = G.topologicalSort(g)

    const svrToFft = G.countPaths('svr', 'fft', g, topoOrder)
    const svrToDac = G.countPaths('svr', 'dac', g, topoOrder)
    const fftToDac = G.countPaths('fft', 'dac', g, topoOrder)
    const dacToFft = G.countPaths('dac', 'fft', g, topoOrder)
    const fftToOut = G.countPaths('fft', 'out', g, topoOrder)
    const dacToOut = G.countPaths('dac', 'out', g, topoOrder)

    const dacFirst = svrToDac * dacToFft * fftToOut
    const fftFirst = svrToFft * fftToDac * dacToOut

    console.log(dacFirst, fftFirst)

    return dacFirst == 0 ? fftFirst : dacFirst
  },
}
