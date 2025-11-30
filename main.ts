import { loadSolution, readExample, readInput } from './solution.ts'

const year = 2021
const day = 4

const solution = await loadSolution(year, day)
const input = await readInput(year, day)
const example = await readExample(year, day)

console.log('One:', solution.one(example))
console.log('Two:', solution.two(input))
