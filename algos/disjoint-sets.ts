// https://en.wikipedia.org/wiki/Disjoint-set_data_structure

import * as R from 'remeda'

export class DisjointSets {
  private readonly _forest: { parent: number; size: number }[]

  constructor(singletonSetCount: number) {
    this._forest = R.range(0, singletonSetCount)
      .map((i) => ({
        parent: i,
        size: 1,
      }))
  }

  public unionSets(i: number, j: number): { i: number; size: number } {
    const rootI = this.root(i)
    const rootJ = this.root(j)
    if (rootI == rootJ) {
      return { i: rootI, size: this._forest[rootI].size }
    }

    if (this._forest[rootI].size >= this._forest[rootJ].size) {
      this._forest[rootJ].parent = rootI
      this._forest[rootI].size += this._forest[rootJ].size
      return { i: rootI, size: this._forest[rootI].size }
    } else {
      this._forest[rootI].parent = rootJ
      this._forest[rootJ].size += this._forest[rootI].size
      return { i: rootJ, size: this._forest[rootJ].size }
    }
  }

  public roots(): { i: number; size: number }[] {
    return this._forest.filter((s, i) => s.parent == i).map((s) => ({
      i: s.parent,
      size: s.size,
    }))
  }

  private root(i: number): number {
    let root = i
    while (this._forest[root].parent != root) {
      root = this._forest[root].parent
    }
    return root
  }
}
