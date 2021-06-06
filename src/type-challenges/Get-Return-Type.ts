type MyReturnType<T> = T extends () => infer R ? R : T;

const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type ret = MyReturnType<typeof fn>;
