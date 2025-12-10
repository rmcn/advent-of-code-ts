import { loadSolution, readExample, readInput } from './solution.ts'

const year = 2025
const day = 10

const solution = await loadSolution(year, day)
const input = await readInput(year, day)
const example = await readExample(year, day)

const start = performance.now()

console.log('One:', solution.one(input))
console.log('Two:', solution.two(example))

console.log((performance.now() - start).toFixed(2), 'ms')
