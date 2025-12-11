import { Solution } from '../solution.ts'
import * as U from '../utls.ts'

export default <Solution> {
  one: (input: string) => {
    const lines = U.lines(input)
    let dial = 50
    let zeroCount = 0
    lines.forEach((line) => {
      if (line[0] == 'L') {
        dial -= U.int(line)
        while (dial < 0) dial += 100
      }
      if (line[0] == 'R') {
        dial += U.int(line)
        while (dial > 99) dial -= 100
      }

      if (dial == 0) {
        zeroCount++
      }
    })

    return zeroCount
  },

  two: (input: string) => {
    const lines = U.lines(input)
    let dial = 50
    let zeroCount = 0
    lines.forEach((line) => {
      const count = U.int(line)
      if (line[0] == 'L') {
        for (let i = 0; i < count; i++) {
          dial--
          if (dial < 0) {
            dial += 100
          }
          if (dial == 0) {
            zeroCount++
          }
        }
      }
      if (line[0] == 'R') {
        for (let i = 0; i < count; i++) {
          dial++
          if (dial > 99) {
            dial -= 100
          }
          if (dial == 0) {
            zeroCount++
          }
        }
      }
    })

    return zeroCount
  },
}
