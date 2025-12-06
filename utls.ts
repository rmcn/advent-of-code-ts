import * as R from 'remeda'

export function lines(input: string): string[] {
  const all = input.split('\n')
  return all.at(-1) == '' ? all.slice(0, -1) : all
}

export function int(s: string): number {
  return Number(s.match(/-?[0-9]+/g)![0])
}

export function ints(s: string): number[] {
  return s.match(/-?[0-9]+/g)?.map((n) => Number(n)) ?? []
}

export function posInts(s: string): number[] {
  return s.match(/[0-9]+/g)?.map((n) => Number(n)) ?? []
}

export function segmentOn<T>(
  data: T[],
  predicate: (item: T) => boolean,
): T[][] {
  const result: T[][] = []
  while (data.length != 0) {
    const [chunk, remainder] = R.splitWhen(data, predicate)
    result.push(chunk)
    data = remainder.slice(1)
  }
  return result
}

export function transpose<T>(data: T[][]): T[][] {
  const result: T[][] = []
  for (let c = 0; c < data[0].length; c++) {
    const row: T[] = []
    for (let r = 0; r < data.length; r++) {
      row.push(data[r][c])
    }
    result.push(row)
  }
  return result
}

export function transposeStrings(data: string[]): string[] {
  const charsList = data.map((s) => s.split(''))
  return transpose(charsList).map((chars) => chars.join(''))
}
