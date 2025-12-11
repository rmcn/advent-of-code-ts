import * as R from 'remeda'

export function countPaths(
  from: string,
  to: string,
  g: Map<string, string[]>,
  topoOrder?: string[],
): number {
  topoOrder ??= topologicalSort(g)

  const pathCounts: Map<string, number> = new Map()
  for (const n of topoOrder) {
    pathCounts.set(n, 0)
  }
  pathCounts.set(from, 1)

  for (const n of topoOrder) {
    for (const m of g.get(n) ?? []) {
      pathCounts.set(m, (pathCounts.get(m) ?? 0) + (pathCounts.get(n) ?? 0))
    }
  }

  const result = pathCounts.get(to) ?? -1

  console.log('Count', from, to, result)

  return result
}

export function topologicalSort(g: Map<string, string[]>) {
  const incomming = invert(g)
  const topoOrder: string[] = []
  const s: string[] = ['svr']

  while (s.length) {
    const n = s.shift()!

    topoOrder.push(n)

    for (const m of g.get(n) ?? []) {
      if (!incomming.get(m)!.has(n)) {
        continue
      }
      incomming.get(m)!.delete(n)

      if (incomming.get(m)!.size == 0) {
        s.push(m)
      }
    }
  }
  return topoOrder
}

export function invert(g: Map<string, string[]>) {
  const incomming: Map<string, Set<string>> = new Map()
  const allValues = g.values().flatMap((v, _) => v).toArray()
  const allKeys = g.keys().toArray()
  for (const n of R.unique(allKeys.concat(allValues))) {
    incomming.set(n, new Set())
  }
  for (const n of g.keys()) {
    for (const m of g.get(n)!) {
      incomming.get(m)!.add(n)
    }
  }
  return incomming
}

export function dfs(
  g: Map<string, string[]>,
  start: string,
  visitor: (node: string) => void,
) {
  const visited: Map<string, boolean> = new Map()
  _dfs(g, start, visited, visitor)
}

function _dfs(
  g: Map<string, string[]>,
  node: string,
  visited: Map<string, boolean>,
  visitor: (node: string) => void,
) {
  visitor(node)

  visited.set(node, true)

  if (g.has(node)) {
    for (const next of g.get(node)!) {
      if (!visited.get(next)) {
        _dfs(g, next, visited, visitor)
      }
    }
  }

  visited.set(node, false)
}
