import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const sockets: Socket[] = parseSockets(input)
    const pairs = pairsByDistance(sockets)

    const MERGE_COUNT = sockets.length <= 20 ? 10 : 1000
    //console.log(sortedPairs.slice(0, MERGE_COUNT))

    for (let i = 0; i < MERGE_COUNT; i++) {
      const pair = pairs[i]
      unionSets(sockets, pair.i, pair.j)
    }

    const sizes = sockets.filter((s, i) => s.parent == i).map((s) => s.size)
    const biggestThree = sizes.sort((a, b) => b - a).slice(0, 3)
    return R.product(biggestThree)
  },

  two: (input: string) => {
    const sockets: Socket[] = parseSockets(input)
    const pairs = pairsByDistance(sockets)

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      const newRoot = unionSets(sockets, pair.i, pair.j)

      if (sockets[newRoot].size == sockets.length) {
        return sockets[pair.i].x * sockets[pair.j].x
      }
    }
  },
}

type Socket = {
  x: number
  y: number
  z: number
  parent: number
  size: number
}

function parseSockets(input: string): Socket[] {
  return U.lines(input).map((v, i) => {
    const [x, y, z] = U.ints(v)
    return {
      x,
      y,
      z,
      parent: i,
      size: 1,
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

function root(sockets: Socket[], i: number): number {
  let root = i
  while (sockets[root].parent != root) {
    root = sockets[root].parent
  }
  return root
}

function unionSets(sockets: Socket[], i: number, j: number): number {
  const rootA = root(sockets, i)
  const rootB = root(sockets, j)
  if (rootA == rootB) {
    //console.log('Already merged')
    return rootA
  }

  if (sockets[rootA].size >= sockets[rootB].size) {
    //console.log(`Merging ${rootB} into ${rootA}`)
    sockets[rootB].parent = rootA
    sockets[rootA].size += sockets[rootB].size
    return rootA
  } else {
    //console.log(`Merging ${rootA} into ${rootB}`)
    sockets[rootA].parent = rootB
    sockets[rootB].size += sockets[rootA].size
    return rootB
  }
}
