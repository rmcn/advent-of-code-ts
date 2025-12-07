import { Solution } from '../solution.ts'
import * as R from 'remeda'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const g = U.lines(input)
    let rayCols: number[] = [g[0].indexOf('S')]
    let splitCount = 0

    for (let row = 1; row < g.length; row++) {
      const newRayCols: number[] = []
      rayCols.forEach((col) => {
        if (g[row][col] == '.') {
          newRayCols.push(col)
        }

        if (g[row][col] == '^') {
          newRayCols.push(col - 1)
          newRayCols.push(col + 1)
          splitCount++
        }
      })
      rayCols = R.unique(newRayCols)
    }

    //console.log(rayCols)
    return splitCount
  },

  two: (input: string) => {
    const g = U.lines(input)
    let rays: Ray[] = [{ col: g[0].indexOf('S'), count: 1 }]

    for (let row = 1; row < g.length; row++) {
      const newRays: Ray[] = []
      rays.forEach((ray) => {
        if (g[row][ray.col] == '.') {
          newRays.push(ray)
        }

        if (g[row][ray.col] == '^') {
          newRays.push({ col: ray.col - 1, count: ray.count })
          newRays.push({ col: ray.col + 1, count: ray.count })
        }
      })
      const groupedRays = R.groupBy(newRays, (ray) => ray.col)
      rays = R.keys(groupedRays).map((col) => ({
        col: Number(col),
        count: R.sum(groupedRays[col].map((r) => r.count)),
      }))
    }

    return R.sum(rays.map((r) => r.count))
  },
}

type Ray = { col: number; count: number }
