import { Solution } from '../solution.ts'
import * as R from 'remeda'
import { int, lines, sum } from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const nums = lines(input)
    const n = nums[0].length
    let gamma = ''
    let epsilon = ''
    for (let i = 0; i < n; i++) {
      let oneCount = 0
      nums.forEach((num) => {
        oneCount += num[i] == '1' ? 1 : 0
      })
      gamma += (oneCount >= nums.length / 2) ? '1' : '0'
      epsilon += (oneCount >= nums.length / 2) ? '0' : '1'
    }
    return parseInt(gamma, 2) * parseInt(epsilon, 2)
  },

  two: (input: string) => {
    const nums = lines(input)
    const oxygen = filterEach(nums, '1', '0')
    const co2 = filterEach(nums, '0', '1')
    return parseInt(oxygen, 2) * parseInt(co2, 2)
  },
}

function filterEach(nums: string[], a: string, b: string) {
  const n = nums[0].length
  let ox = nums.slice()
  for (let i = 0; i < n; i++) {
    const counts = R.mapValues(R.groupBy(ox, (l) => l[i]), (g) => g.length)
    const filter = (counts['1'] >= counts['0']) ? a : b
    ox = ox.filter((n) => n[i] == filter)
    if (ox.length == 1) return ox[0]
  }
  return ''
}
