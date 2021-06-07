type TupleToUnion<T> = T extends any[] ? T[number] : never;

// 应该为： 123 | '456' | true
const test: TupleToUnion<[123, "456", true]> = 123;
