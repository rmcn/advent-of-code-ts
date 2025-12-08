import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'
import { DisjointSets } from '../algos/disjoint-sets.ts'

export default <Solution> {
  one: (input: string) => {
    const sockets: Socket[] = parseSockets(input)
    const pairs = pairsByDistance(sockets)
    const sets = new DisjointSets(sockets.length)

    const MERGE_COUNT = sockets.length <= 20 ? 10 : 1000
    for (let i = 0; i < MERGE_COUNT; i++) {
      const pair = pairs[i]
      sets.unionSets(pair.i, pair.j)
    }

    const sizes = sets.roots().map((s) => s.size)
    const biggestThree = sizes.sort((a, b) => b - a).slice(0, 3)
    return R.product(biggestThree)
  },

  two: (input: string) => {
    const sockets: Socket[] = parseSockets(input)
    const pairs = pairsByDistance(sockets)
    const sets = new DisjointSets(sockets.length)

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      const newRoot = sets.unionSets(pair.i, pair.j)

      if (newRoot.size == sockets.length) {
        return sockets[pair.i].x * sockets[pair.j].x
      }
    }
  },
}

type Socket = {
  x: number
  y: number
  z: number
}

function parseSockets(input: string): Socket[] {
  return U.lines(input).map((v) => {
    const [x, y, z] = U.ints(v)
    return {
      x,
      y,
      z,
    }
  })
}

function pairsByDistance(sockets: Socket[]) {
  const pairs: { i: number; j: number; dSquared: number }[] = []
  for (let i = 0; i < sockets.length; i++) {
    const a = sockets[i]
    for (let j = i + 1; j < sockets.length; j++) {
      const b = sockets[j]
      const dSquared = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) +
        Math.pow(a.z - b.z, 2)
      pairs.push({ i, j, dSquared })
    }
  }

  return R.sortBy(pairs, R.prop('dSquared'))
}
