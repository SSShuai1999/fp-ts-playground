type MyReturnType<T> = T extends () => infer R ? R : T;

const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type ret = MyReturnType<typeof fn>;

type MyOmit<T, K> = {
  [S in keyof T]: S extends K ? never : T[S];
};

type cases = [
  //   Expect<Equal<Expected1, MyOmit<Todo, 'description'>>>,
//   Expect<Equal<Expected2, MyOmit<Todo, 'description' | 'completed'>>>
];

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

interface Expected1 {
  title: string;
  completed: boolean;
}

interface Expected2 {
  title: string;
}

type GetReturnTypeTest = MyOmit<Todo, "description" | "completed">;
