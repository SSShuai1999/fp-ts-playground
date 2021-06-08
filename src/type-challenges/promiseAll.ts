declare function PromiseAll<T extends readonly any[]>(
  values: [...T]
): Promise<
  {
    [K in keyof T]: T[K] extends Promise<infer R> ? R : T[K];
  }
>;

// your answers
type Includes<T extends any[], U> = "true" extends {
  [V in keyof T]: T[V] extends U ? "true" : false;
}[number]
  ? true
  : false;

const promiseAllTest = PromiseAll([Promise.resolve("123"), 2, 3]);
