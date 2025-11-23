export interface Solution {
  one: (input: string) => string | number
  two: (input: string) => string | number
}

export async function loadSolution(
  year: number,
  day: number,
): Promise<Solution> {
  const { default: solution } = await import(
    `./${year}/${String(day).padStart(2, '0')}.ts`
  )
  return solution
}

export async function readInput(year: number, day: number): Promise<string> {
  const path = `./inputs/${year}/${String(day).padStart(2, '0')}.txt`

  try {
    await Deno.lstat(path)
    console.log(`Reading ${path}`)
    return await Deno.readTextFile(path)
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err
    }

    const response = await fetch(
      `https://adventofcode.com/${year}/day/${day}/input`,
      {
        headers: { 'Cookie': `session=${Deno.env.get('AOC_SESSION')}` },
      },
    )

    const input = await response.text()

    await Deno.writeTextFile(path, input)

    console.log(`Fetched ${path}`)
    return input
  }
}
