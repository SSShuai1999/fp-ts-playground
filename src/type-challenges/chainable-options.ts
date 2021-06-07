type Chainable<Options = {}> = {
  option<K extends string, V>(
    key: K,
    value: V
  ): Chainable<Options & { [S in K]: V }>;
  get(): Options;
};

declare const a: Chainable;

const result = a
  .option("foo", 123)
  .option("bar", { value: "Hello World" })
  .option("name", "type-challenges")
  .get();
