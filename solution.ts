export interface Solution {
  one: (input: string) => string | number
  two: (input: string) => string | number
}

export async function loadSolution(
  year: number,
  day: number,
): Promise<Solution> {
  const path = `./${year}/${String(day).padStart(2, '0')}.ts`
  const { default: solution } = await import(path)
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

export async function readExample(year: number, day: number): Promise<string> {
  const path = `./inputs/${year}/${String(day).padStart(2, '0')}-example.txt`

  try {
    await Deno.lstat(path)
    console.log(`Reading ${path}`)
    return await Deno.readTextFile(path)
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err
    }

    const response = await fetch(
      `https://adventofcode.com/${year}/day/${day}`,
      {
        headers: { 'Cookie': `session=${Deno.env.get('AOC_SESSION')}` },
      },
    )

    const lines = (await response.text()).split('\n')
    const start = lines.findIndex((l) => l.startsWith('<pre><code>'))
    const end = lines.findIndex((l) => l.startsWith('</code></pre>'))

    const exampleLines = (start != -1 && end != -1)
      ? lines.slice(start, end)
      : ['none :-(']
    exampleLines[0] = exampleLines[0].substring('<pre><code>'.length)
    const example = exampleLines.join('\n')

    await Deno.writeTextFile(path, example)

    console.log(`Fetched ${path}`)
    return example
  }
}
