type DeepKeys<T> = T extends dykey
  ? {
      [K in keyof T]-?: `${K & string}` | Concat<K & string, DeepKeys<T[K]>>
    }[keyof T]
  : ''
// or: only get leaf and no intermediate key path
export type DeepLeafKeys<T> = T extends dykey
  ? { [K in keyof T]-?: Concat<K & string, DeepKeys<T[K]>> }[keyof T]
  : ''
export type Concat<K extends string, P extends string> = `${K}${'' extends P
  ? ''
  : '.'}${P}`

export type dykey = {
  [k: string]: any
}
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? A
  : B

type WritableKeys<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]

type DeepWritablePrimitive =
  | undefined
  | null
  | boolean
  | string
  | number
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
/**返回去除readOnly字段的type */
export type DeepWritable<T> = T extends DeepWritablePrimitive
  ? T
  : T extends Array<infer U>
  ? DeepWritableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepWritableMap<K, V>
  : T extends Set<infer T>
  ? DeepWriableSet<T>
  : DeepWritableObject<T>

type DeepWritableArray<T> = Array<DeepWritable<T>>
type DeepWritableMap<K, V> = Map<K, DeepWritable<V>>
type DeepWriableSet<T> = Set<DeepWritable<T>>

type DeepWritableObject<T> = {
  [K in WritableKeys<T>]: DeepWritable<T[K]>
}

/**Partial 特殊字段必须版 */
export type PartialExclude<A, B extends keyof A> = Partial<A> &
  {
    [K in B]: A[K]
  }
/**Partial 特殊字段选填版 */
export type PartialInclude<A, B extends keyof A> = Partial<A> &
  {
    [K in keyof Omit<A, B>]: A[K]
  }

export function omitOjbect<T, K extends keyof T>(obj: T, key: K[]): Omit<T, K> {
  let rs = { ...obj }
  key.forEach((k) => delete rs[k])
  return rs
}
