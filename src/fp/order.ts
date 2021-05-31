import { Eq } from "fp-ts/lib/Eq";
import { Ord, fromCompare, contramap } from "fp-ts/lib/Ord";
import { getDualOrd } from "fp-ts/lib/Ord";

export default (() => {
  type Ordering = -1 | 0 | 1;

  // 自己定义的 Ord
  // interface Ord<A> extends Eq<A> {
  //   readonly compare: (x: A, y: A) => Ordering
  // }

  const ordNumber: Ord<number> = fromCompare((x, y) =>
    x < y ? -1 : x > y ? 1 : 0
  );
  //  上面和下面相等  //
  // const ordNumber: Ord<number> = {
  //   equals: (x, y) => x === y,
  //   compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
  // }

  ordNumber.compare(1, 2); // logs => `-1`
  ordNumber.compare(2, 2); // logs => ` 0`
  ordNumber.compare(3, 2); // logs => ` 1`

  function min1<A>(O: Ord<A>): (x: A, y: A) => A {
    return (x, y) => (O.compare(x, y) === 1 ? y : x);
  }

  function max1<A>(O: Ord<A>): (x: A, y: A) => A {
    return (x, y) => (O.compare(x, y) === 1 ? x : y);
  }

  const t1: Ord<number> = {
    compare: (x, y) => (x < y ? -1 : x === y ? 0 : -1),
    equals: (x, y) => x === y,
  };

  min1(t1)(1, 2); // logs => `1`
  max1(t1)(1, 2); // logs => `2`

  type User = {
    name: string;
    age: number;
  };

  const byAge1: Ord<User> = fromCompare((x, y) =>
    ordNumber.compare(x.age, y.age)
  );

  byAge1.compare({ name: "shuai", age: 21 }, { name: "qi", age: 22 }); // logs => `-1`
  byAge1.compare({ name: "shuai", age: 22 }, { name: "qi", age: 22 }); // logs => ` 0`
  byAge1.compare({ name: "shuai", age: 23 }, { name: "qi", age: 22 }); // logs => ` 1`

  // 我们可以使用逆映射组合器来避免一些样板文件
  const byAge2: Ord<User> = contramap((user: User) => user.age)(ordNumber);

  byAge2.compare({ name: "shuai", age: 21 }, { name: "qi", age: 22 }); // logs => `-1`
  byAge2.compare({ name: "shuai", age: 22 }, { name: "qi", age: 22 }); // logs => ` 0`
  byAge2.compare({ name: "shuai", age: 23 }, { name: "qi", age: 22 }); // logs => ` 1`

  const getYounger = min1(byAge2);
  getYounger({ name: "shuai", age: 22 }, { name: "qi", age: 23 }); // logs => `{ name: "shuai", age: 22 }`

  // 内部进行了 `reverse` 操作
  function max<A>(O: Ord<A>): (x: A, y: A) => A {
    return min1(getDualOrd(O));
  }

  const getOlder = max(byAge2);
  getOlder({ name: "shuai", age: 22 }, { name: "qi", age: 23 }); // logs => `{ name: "qi", age: 23 }`
})();
