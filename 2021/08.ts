import { Solution } from '../solution.ts'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    let count = 0
    const lines = U.lines(input)
    for (const line of lines) {
      const [_, display] = line.split('|').map((s) => s.trim().split(' '))
      count += display.filter((s) =>
        s.length == 7 || s.length == 4 || s.length == 3 || s.length == 2
      ).length
    }
    return count
  },

  two: (input: string) => {
    const standardDigits = [
      'abcefg', // 0
      'cf', // 1
      'acdeg', // 2
      'acdfg', // 3
      'bcdf', // 4
      'abdfg', // 5
      'abdefg', // 6
      'acf', // 7
      'abcdefg', // 8
      'abcdfg', // 9
    ]

    let total = 0
    const lines = U.lines(input)
    for (const line of lines) {
      const [digits, display] = line.split('|').map((s) => s.trim().split(' '))
      const map = calculateMapping(digits)
      const mapped = display.map((d) => mapToStandard(d, map))
      const mappedDigits = mapped.map((d) => standardDigits.indexOf(d)).map(
        (d) => d.toString(),
      ).join('')
      total += Number.parseInt(mappedDigits)
    }

    return total
  },
}

function calculateMapping(digits: string[]): string[] {
  const one = digits.find((s) => s.length == 2)!
  const seven = digits.find((s) => s.length == 3)!
  const four = digits.find((s) => s.length == 4)!

  const a = removeEach(digits, one).filter((s) => s.length == 1)[0]
  const g = removeEach(digits, a + four).filter((s) => s.length == 1)[0]
  const e = removeEach(digits, a + four + g).filter((s) => s.length == 1)[0]
  const d = removeEach(digits, seven + e + g).filter((s) => s.length == 1)
    .sort()[1]
  const b =
    removeEach(digits, seven + e + g + d).filter((s) => s.length == 1)[0]

  const f = removeEach(digits, a + d + b + g).filter((s) => s.length == 1)[0]
  const c = removeEach([one], f).filter((s) => s.length == 1)[0]

  return [a, b, c, d, e, f, g]
}

function removeEach(digitLookup: string[], replaceChars: string): string[] {
  return digitLookup.map((s) => remove(s, replaceChars))
}

function remove(s: string, removeChars: string) {
  for (const c of removeChars.split('')) {
    s = s.replace(c, '')
  }
  return s
}

function mapToStandard(d: string, map: string[]): string {
  return d.split('').map((c) => String.fromCharCode(97 + map.indexOf(c))).sort()
    .join('')
}
