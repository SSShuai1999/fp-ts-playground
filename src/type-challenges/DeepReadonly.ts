type DeepReadonly<T> = {
  readonly [V in keyof T]: T[V] extends Object
    ? T[V] extends (...args: any[]) => any
      ? T[V]
      : DeepReadonly<T[V]>
    : T[V];
};

type test = DeepReadonly<X>;

const testC: test = {
  a: () => 22,
  b: "是是是",
  c: {
    d: true,
    e: {
      g: {
        h: {
          i: true,
          j: "string",
        },
        k: "hello",
      },
    },
  },
};

type X = {
  a: () => 22;
  b: string;
  c: {
    d: boolean;
    e: {
      g: {
        h: {
          i: true;
          j: "string";
        };
        k: "hello";
      };
    };
  };
};

type Expected = {
  readonly a: () => 22;
  readonly b: string;
  readonly c: {
    readonly d: boolean;
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true;
          readonly j: "string";
        };
        readonly k: "hello";
      };
    };
  };
};
