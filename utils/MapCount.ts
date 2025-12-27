export class MapCount<T> {
  private counts = new Map<T, number>()

  public add(key: T) {
    if (this.counts.has(key)) {
      this.counts.set(key, this.counts.get(key)! + 1)
    } else {
      this.counts.set(key, 1)
    }
  }

  /** All keys with values >= limit */
  public keys(predicate: (count: number) => boolean): T[] {
    return this.counts.entries().filter(([_, v]) => predicate(v)).map((
      [k, _],
    ) => k)
      .toArray()
  }
}
