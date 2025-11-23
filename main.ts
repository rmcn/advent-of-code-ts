import { loadSolution, readInput } from './solution.ts'

const year = 2021
const day = 1

const solution = await loadSolution(year, day)
const input = await readInput(year, day)

console.log('One:', solution.one(input))
console.log('Two:', solution.two(input))
