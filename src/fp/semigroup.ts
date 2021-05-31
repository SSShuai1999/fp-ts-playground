/**
 * 半群
 */

import {
  getStructSemigroup,
  Semigroup,
  semigroupAll,
  getFunctionSemigroup,
  getMeetSemigroup,
  getJoinSemigroup,
  fold,
  semigroupSum,
  semigroupProduct,
  semigroupAny,
} from "fp-ts/lib/Semigroup";
import { getApplySemigroup, some, none } from "fp-ts/lib/Option";
import { getMonoid } from "fp-ts/lib/Array";
import { ordNumber, contramap } from "fp-ts/lib/Ord";
import { SemigroupAny } from "fp-ts/lib/boolean";

export default (() => {
  /**
   * General definition 一般定义
   * 半群是一对 (A, *)，其中 a 是一个非空集， * 是 A 上的一个二元结合运算，即一个函数，它以 a 的两个元素作为输入，并返回 a 的一个元素作为输出。
   * *: (x: A, y: A) => A
   * 而联想意味着方程式
   * (x * y) * z = x * (y * z)
   * 对于 A 中所有 x, y, z 都成立。
   * 结合性告诉我们，我们不必担心表达式的括号，可以写 x * y * z
   * 半群抓住了平行化运算的本质
   * (number,  *)
   * (string,  +)
   * (boolean, &)
   * ....
   */

  /**
   * Type class definition 类型定义
   * 通常在 fp-ts 中，fp-ts/lib/semigroup 模块中包含的类型类半群被实现为一个 Typescript 接口，其中操作 * 被命名为 concat
   */

  interface Semigroup<A> {
    concat: (x: A, y: A) => A;
  }

  /**
   * 必须满足以下条件：
   * Associativity 联想性
   * concat(concat(x, y), z) = concat(x, concat(y, z))
   * 名称 concat 对数组有特殊的意义，但是，根据上下文和我们实现实例的类型 A，半群运算可以用不同的意义来解释
   * concatenation
   * merging 合并
   * funsion 融合
   * selection 选择
   * addition 加法
   * substitution 替换
   * 还有更多...
   */

  /**
   * Instances 实例
   */

  /**
   * 半群 (number, *)
   */
  const semigroupProduct: Semigroup<number> = {
    concat: (x, y) => x * y,
  };

  /** 注意，可以为同一类型定义不用的半群实例，这是半群 (number, +) 的实现，其中 + 是通常的数的加法 */
  const semigroupSum: Semigroup<number> = {
    concat: (x, y) => x + y,
  };

  /** 另一个例子，这次是带字符串的 */
  const semigroupString: Semigroup<string> = {
    concat: (x, y) => x + y,
  };

  /** 如果给定一个类型 A, 你不能在 A 上找到一个关联运算，那该怎么办？ 可以使用以下结构为每个类型创建（平凡的）半群实例 */

  /** 永远返回第一个参数 */
  function getFirstSemigroup<A = never>(): Semigroup<A> {
    return { concat: (x, y) => x };
  }

  /** 永远返回第二个参数 */
  function getLastSemigroup<A = never>(): Semigroup<A> {
    return { concat: (x, y) => y };
  }

  /** 另一种技巧是定义阵列 <A>(*)的半群实例，称为 A 的自由半群 */
  function getArraySemigroup<A = never>(): Semigroup<Array<A>> {
    return { concat: (x, y) => x.concat(y) };
  }

  /** 并将 A 的元素映射到 Array<a> 的单个元素上 */
  function of<A>(a: A): Array<A> {
    return [a];
  }

  /**
   * (*) 严格地说是 A 的非空数组的半群实例
   * 注意，这里 concat 是本机数组方法，它在一定程度上解释了半群运算名称的初始选择
   * A 的自由半群是元素都可能是 a 的元素的非空有限序列的半群
   */

  /**
   * Deriving from 源于 ord
   * 还有一种方法可以为 A 型构建一个半群实例：如果我们已经有一个 A 的 Ord 实例，那么我们可以将它 "转换" 成一个半群
   * 实际上是两个可能的半群
   */

  /** 在两个数中拿走最小数 */
  const semigroupMin: Semigroup<number> = getMeetSemigroup(ordNumber);

  /** 在两个数中拿走最大数 */
  const semigroupMax: Semigroup<number> = getJoinSemigroup(ordNumber);

  semigroupMin.concat(2, 1); // logs => `1`
  semigroupMax.concat(2, 1); // logs => `2`

  /**
   * 让我们为更复杂的类型编写一些半群实例
   */

  type Point = {
    x: number;
    y: number;
  };

  /** （手写） fp-ts 提供了对应的模块 */
  // const semigroupPoint: Semigroup<Point> = {
  //   concat: (p1, p2) => ({
  //     x: semigroupSum.concat(p1.x, p2.x),
  //     y: semigroupSum.concat(p1.y, p2.y),
  //   })
  // }

  /**
   * 尽管这大多是样板文件。好消息是，如果我们可以为每个字段提供一个半群实例，我们就可以为 Point 这样的结构构建一个半群实例。
   */
  const semigroupPoint: Semigroup<Point> = getStructSemigroup({
    x: semigroupSum,
    y: semigroupSum,
  });

  /** 我们可以继续使用刚刚定义的实例来填充 getstruct 半群 */

  type Vector = {
    from: Point;
    to: Point;
  };

  const semigroupVector: Semigroup<Vector> = getStructSemigroup({
    from: semigroupPoint,
    to: semigroupPoint,
  });

  /**
   * Getstruct 半群不是 fp-ts 提供的唯一组合子，这里有一个组合子，它允许推到函数的半群实例：给定 s 的半群实例，我们可以推到出具有签名（a: A）=> s 的函数的半群实例，对于所有 A
   */

  /** `semigroupAll` is the boolean semigroup under conjunction */
  const semigroupPredicate: Semigroup<(p: Point) => boolean> =
    getFunctionSemigroup(semigroupAll)<Point>();

  /** 现在我们可以 "合并" point 上的两个 predicates */
  const isPositiveX = (p: Point): boolean => p.x >= 0;
  const isPositiveY = (p: Point): boolean => p.y >= 0;

  const isPositiveXY = semigroupPredicate.concat(isPositiveX, isPositiveY);

  isPositiveXY({ x: 1, y: 1 }); // logs => `true`
  isPositiveXY({ x: 1, y: -1 }); // logs => `false`
  isPositiveXY({ x: -1, y: 1 }); // logs => `false`
  isPositiveXY({ x: -1, y: -1 }); // logs => `false`

  /**
   * Folding
   * 根据定义 concat 只能使用 a 的两个元素，如果我们想要使用更多的元素怎么办？
   * fold 函数采用一个半群实例，一个初始值，一个元素数组
   */

  const sum = fold(semigroupSum);

  sum(0, [1, 2, 3, 4]); // 10

  const product = fold(semigroupProduct);

  product(1, [1, 2, 3, 4]); // 24

  /**
   * Semigroups for type constructors 类型构造函数的半群
   * 如果我们想要合并两个 Option<A>? 有四种情况:
   *
   * x            y            concat(x, y)
   * -----------------------------------------
   * none         none          none
   * -----------------------------------------
   * some(a)      none          none
   * -----------------------------------------
   * none         some(a)       none
   * -----------------------------------------
   * some(a)      some(b)       ?
   * -----------------------------------------
   */

  /**
   * 最后一个有个问题，我们需要一些东西来 `合并` 两个 A
   * 这就是半群所做的！我们可以要求 A 的半群实例，然后推到出 Option<A> 的半群实例。这就是 getApplySemigroup 的工作原理
   */
  const S = getApplySemigroup(semigroupSum);
  S.concat(some(1), none); // none
  S.concat(some(1), some(2)); // some(3)

  /**
   * 我们已经看到，当我们想要 `concat`，`merge` or `combine` (无论什么词给你最好的直觉) 几个数据集合成一个时，半群帮助我们。
   * 我们用最后一个例子来总结以下
   */

  /**
   * 让我们假设您正在构建一个系统，其中存储的客户记录如下所示：
   */
  interface Customer {
    name: string;
    favouriteThings: Array<string>;
    registeredAt: number;
    lastUpdatedAt: number;
    hasMadePurchase: boolean;
  }

  /**
   * 不管出于什么原因，您最终可能会为同一个人生成重复的记录，我们需要的是一个合并策略，这就是半群的全部
   */

  const semigroupCustomer: Semigroup<Customer> = getStructSemigroup({
    // keep the loger name
    name: getJoinSemigroup(contramap((s: string) => s.length)(ordNumber)),
    // accumulate things
    favouriteThings: getMonoid<string>(), // <= getMonoid returns a Semigroup for `Array<string>` see later
    // keep the least recent date
    registeredAt: getMeetSemigroup(ordNumber),
    // keep the most recent data
    lastUpdatedAt: getJoinSemigroup(ordNumber),
    // Boolean semigroup under disjunction
    hasMadePurchase: SemigroupAny,
  });

  semigroupCustomer.concat(
    {
      name: "Giulio",
      favouriteThings: ["math", "climbing"],
      registeredAt: new Date(2018, 1, 20).getTime(),
      lastUpdatedAt: new Date(2018, 2, 18).getTime(),
      hasMadePurchase: false,
    },
    {
      name: "Giulio Canti",
      favouriteThings: ["functional programming"],
      registeredAt: new Date(2018, 1, 22).getTime(),
      lastUpdatedAt: new Date(2018, 2, 9).getTime(),
      hasMadePurchase: true,
    }
  );

  /*
    { name: 'Giulio Canti',
    favouriteThings: [ 'math', 'climbing', 'functional programming' ],
    registeredAt: 1519081200000, // new Date(2018, 1, 20).getTime()
    lastUpdatedAt: 1521327600000, // new Date(2018, 2, 18).getTime()
    hasMadePurchase: true }
  */

  /**
   * 函数 getMonoid 返回数组 < 字符串 > 的半群。实际上它返回的不仅仅是一个半群: monoid。
   */
})();
