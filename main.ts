import { loadSolution, readExample, readInput } from './solution.ts'

const year = 2021
const day = 8

const solution = await loadSolution(year, day)
const input = await readInput(year, day)
const example = await readExample(year, day)

const start = performance.now()

console.log('One:', solution.one(input))
console.log('Two:', solution.two(input))

console.log((performance.now() - start).toFixed(2), 'ms')
