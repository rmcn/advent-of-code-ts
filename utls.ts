import * as R from 'remeda'

export function lines(input: string): string[] {
  const all = input.split('\n')
  return all.at(-1) == '' ? all.slice(0, -1) : all
}

export function int(s: string): number {
  return Number(s.match(/-?[0-9]+/g)![0])
}

export function sum(nums: number[]): number {
  return R.reduce(nums, (a, b) => a + b, 0)
}
