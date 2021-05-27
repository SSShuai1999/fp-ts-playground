import { getStructEq } from "fp-ts/lib/Eq";
import { getEq } from "fp-ts/lib/Array";
import { contramap } from "fp-ts/lib/Eq";

export default (() => {
  interface Eq<A> {
    /** ret `true` if `x` is equal to `y` */
    equals: (x: A, y: A) => boolean;
  }

  // 该声明可被解读为：A 类型属于类 Eq 类型，如果有一个与其相应类型相等的函数在其上定义的话
  const eqNumber: Eq<number> = {
    equals: (x, y) => x === y,
  };

  /**
   * 实例必须要符合以下条件：
   * `Reflexivity`    equals（x, x） === true             自反性
   * `Symmetry`       equals(x, y) === equals(y, x)       对称性
   * `Transitivity`   equals(x, y) === true;              及物性
   *                  equals(y, z) === true;
   *                  由此可以得出：x = z
   *                  => equlas(x, z) === true
   */
  function elem<A>(E: Eq<A>): (a: A, as: A[]) => boolean {
    return (a, as) => as.some((item) => E.equals(item, a));
  }

  const isEqByA$AS = elem(eqNumber);
  isEqByA$AS(1, [2, 3, 4, 5]); // logs -> `false`
  isEqByA$AS(1, [1, 2, 3, 4]); // logs -> `true`

  // 更复杂些 😀😁😂😃😄😅😆😉😊😋😎😍😘😗😙😚😇😐😑😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲😷😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈

  const eqPoint = getStructEq({
    x: eqNumber,
    y: eqNumber,
  });

  eqPoint.equals({ x: 1, y: 1 }, { x: 1, y: 1 }); // logs => `true`

  const eqArrayOfPoints = getEq(eqPoint);
  eqArrayOfPoints.equals([{ x: 1, y: 1 }], [{ x: 1, y: 1 }]); // logs => `true`

  type User<T = string> = {
    userId: number;
    name: T;
  };

  const eqByIncludes = {
    equals: (x: string, y: string) => x.includes(y),
  };

  const eqById = {
    equals: (x: number, y: number) => x > y,
  };

  const eqUser1 = contramap((user: User) => user.name)(eqByIncludes);
  const eqUser2 = contramap((user: User) => user.userId)(eqById);

  const or1 = { userId: 100, name: "帅神orz" };
  const or2 = { userId: 101, name: "orz" };

  eqUser1.equals(or1, or2); // logs => true
  eqUser2.equals(or1, or2); // logs => false

  function elem2<A>(E: Eq<A>): (a: A, as: A[]) => boolean {
    return (a, as) => as.some((item) => E.equals(item, a));
  }

  const eqElem: Eq<number> = {
    equals: (x, y) => x > y,
  };

  elem2(eqElem)(5, [1, 2, 3, 4]); // logs -> false
  elem2(eqElem)(5, [1, 2, 3, 4, 5, 6]); // logs -> true
})();
