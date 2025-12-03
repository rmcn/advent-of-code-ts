import { loadSolution, readExample, readInput } from './solution.ts'

const year = 2025
const day = 3

const solution = await loadSolution(year, day)
const input = await readInput(year, day)
const example = await readExample(year, day)

console.log('One:', solution.one(input))
console.log('Two:', solution.two(input))
