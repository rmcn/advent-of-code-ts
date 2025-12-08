import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const sockets: Socket[] = U.lines(input).map((v, i) => {
      const [x, y, z] = U.ints(v)
      return {
        x,
        y,
        z,
        i,
        parent: i,
        size: 1,
      }
    })

    const MERGE_COUNT = sockets.length <= 20 ? 10 : 1000

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

    const sortedPairs = R.sortBy(pairs, R.prop('dSquared'))
    //console.log(sortedPairs.slice(0, MERGE_COUNT))

    for (let i = 0; i < MERGE_COUNT; i++) {
      const pair = sortedPairs[i]
      const rootA = root(sockets, pair.i)
      const rootB = root(sockets, pair.j)
      if (rootA == rootB) {
        //console.log('Already merged')
        continue
      }

      if (sockets[rootA].size >= sockets[rootB].size) {
        //console.log(`Merging ${rootB} into ${rootA}`)
        sockets[rootB].parent = rootA
        sockets[rootA].size += sockets[rootB].size
      } else {
        //console.log(`Merging ${rootA} into ${rootB}`)
        sockets[rootA].parent = rootB
        sockets[rootB].size += sockets[rootA].size
      }
    }

    const lengths = sockets.map((s) => s.size)
    const longestThree = lengths.sort((a, b) => a - b).reverse().slice(0, 3)
    return R.product(longestThree)
  },

  two: (input: string) => {
    const sockets: Socket[] = U.lines(input).map((v, i) => {
      const [x, y, z] = U.ints(v)
      return {
        x,
        y,
        z,
        i,
        parent: i,
        size: 1,
      }
    })

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

    const sortedPairs = R.sortBy(pairs, R.prop('dSquared'))
    //console.log(sortedPairs.slice(0, MERGE_COUNT))

    for (let i = 0; i < sortedPairs.length; i++) {
      const pair = sortedPairs[i]
      const rootA = root(sockets, pair.i)
      const rootB = root(sockets, pair.j)
      if (rootA == rootB) {
        //console.log('Already merged')
        continue
      }

      if (sockets[rootA].size >= sockets[rootB].size) {
        //console.log(`Merging ${rootB} into ${rootA}`)
        sockets[rootB].parent = rootA
        sockets[rootA].size += sockets[rootB].size
        if (sockets[rootA].size == sockets.length) {
          return sockets[pair.i].x * sockets[pair.j].x
        }
      } else {
        //console.log(`Merging ${rootA} into ${rootB}`)
        sockets[rootA].parent = rootB
        sockets[rootB].size += sockets[rootA].size
        if (sockets[rootB].size == sockets.length) {
          return sockets[pair.i].x * sockets[pair.j].x
        }
      }
    }
  },
}

type Socket = {
  x: number
  y: number
  z: number
  i: number
  parent: number
  size: number
}

function root(sockets: Socket[], i: number): number {
  let root = i
  while (sockets[root].parent != root) {
    root = sockets[root].parent
  }
  return root
}
