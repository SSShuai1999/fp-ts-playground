/**
 * 幺半群
 */

import { Semigroup } from "fp-ts/lib/Semigroup";
import { getStructMonoid, Monoid, fold } from "fp-ts/lib/Monoid";
import {
  getApplyMonoid,
  some,
  none,
  getFirstMonoid,
  Option,
  getLastMonoid,
} from "fp-ts/lib/Option";

export default (() => {
  /**
   * Type class definition 类型定义
   * 通常在 fp-ts 中， fp-ts/lib/Monoid 模块中包含的类型类 Monoid 被实现为一个 Typescript 接口，其中的 nentral 值为空
   */

  interface Monoid<A> extends Semigroup<A> {
    readonly empty: A;
  }

  /**
   * 以下条件必须成立
   * right identity 右身份 concat(x, empty) = x
   * left identity 左身份 concat(empty, x) = x
   * 无论我们将值放在 concat 的哪一边，它都必须与值没有任何区别。
   * 注意：如果一个空值存在，那么它是唯一的。
   */

  /**
   * Instance 实例
   * 我们之前使用的大多半群实际上是幺半群
   */

  /** number `Monoid` under addition */
  const monoidSum: Monoid<number> = {
    concat: (x, y) => x + y,
    empty: 0,
  };

  /** number `Monoid` under multiplication */
  const monoidProduct: Monoid<number> = {
    concat: (x, y) => x * y,
    empty: 1,
  };

  const monoidString: Monoid<string> = {
    concat: (x, y) => x + y,
    empty: "",
  };

  const monoidAll: Monoid<boolean> = {
    concat: (x, y) => x && y,
    empty: true,
  };

  const monoidAny: Monoid<boolean> = {
    concat: (x, y) => x || y,
    empty: false,
  };

  /**
   * 你可能想知道是否所有的半群都是幺半群，但事实并非如此，作为一个反例，考虑下面的半群。
   */
  const semigroupSpace: Semigroup<string> = {
    concat: (x, y) => x + " " + y,
  };

  /**
   * 我们不能找到一个空值，比如 concat(x, empty) = x
   * 让我们为更复杂的类型编写一些 Monoid 实例
   */
  type Point = {
    x: number;
    y: number;
  };

  /**
   * 如果我们可以为每个字段提供一个 Monoid 实例
   */

  const monoidPoint: Monoid<Point> = getStructMonoid({
    x: monoidSum,
    y: monoidSum,
  });

  console.log(monoidPoint);

  /**
   * 我们可以继续使用刚刚定义的实例提供 getStructMonoid
   */

  type Vector = {
    from: Point;
    to: Point;
  };

  const monoidVector: Monoid<Vector> = getStructMonoid({
    from: monoidPoint,
    to: monoidPoint,
  });

  /**
   * Folding
   * 当使用 monoid 而不是半群时， folding 就更简单了，我们不需要显示地提供初始值（实现可以使用 monoid 的空值）
   */

  fold(monoidSum)([1, 2, 3, 4]);
  fold(monoidProduct)([1, 2, 3, 4]);
  fold(monoidString)(["a", "b", "c"]);
  fold(monoidAll)([true, true, true]);
  fold(monoidAny)([false, false, false]);

  /**
   * 我们已经知道，给定 A 的版区你实力，我们可以导出选项 <A> 的半群实例
   * 如果我们能为 A 找到一个 monoid 实例，那么我们就能为 Option<A> 派生一个 monoid 实例（通过 getApplyMonoid），它的工作原理如下
   *
   * x                y               concat(x, y)
   * -----------------------------------------------------
   * none             none            none
   * -----------------------------------------------------
   * some(a)          none            none
   * -----------------------------------------------------
   * none             some(a)         none
   * -----------------------------------------------------
   * some(a)          some(b)         some(concat(a, b))
   * -----------------------------------------------------
   */

  const M = getApplyMonoid(monoidSum);

  M.concat(some(1), none); // none
  M.concat(some(1), some(2)); // some(3)
  M.concat(some(1), M.empty); // some(1)

  /**
   * 对于 Option<A>，我们可以到处另外两个幺半群
   * getFirstMonoid ...
   * 返回最左的非 none 值
   *
   * x                y               concat(x, y)
   * -----------------------------------------------------
   * none             none            none
   * -----------------------------------------------------
   * some(a)          none            some(a)
   * -----------------------------------------------------
   * none             some(a)         some(a)
   * -----------------------------------------------------
   * some(a)          some(b)         some(b)
   * -----------------------------------------------------
   */

  const M2 = getFirstMonoid<number>();
  M2.concat(some(1), none); // some(1)
  M2.concat(some(1), some(2)); // some(2)

  /**
   * 例如，getLastMonoid 可用于管理可选值
   */

  interface Settings {
    /** Controls the font family */
    fontFamily: Option<string>;

    /** Controls the font size in pixels */
    fontSize: Option<number>;

    /** Limit the width the minimap to render at most a certain number of columns. */
    maxColumn: Option<number>;
  }

  type Ocarm<T> = {
    [K in keyof T]: T[K] extends Option<infer R> ? R : T[K];
  };

  const monoidSettings: Ocarm<Monoid<Settings>> = getStructMonoid({
    fontFamily: getLastMonoid(),
    fontSize: getLastMonoid(),
    maxColumn: getFirstMonoid(),
  });

  const workspaceSettings: Settings = {
    fontFamily: some("Courier"),
    fontSize: none,
    maxColumn: none,
  };

  const userSettings: Settings = {
    fontFamily: some("Fira Code"),
    fontSize: some(12),
    maxColumn: some(80),
  };

  /** userSettings overrides workspaceSettings */
  monoidSettings.concat(workspaceSettings, userSettings);

  /**
   * logs ↓
   * {
   *   fontFmaily: some("Fira Code"),
   *   fontSize: some(12),
   *   maxColumn: some(80)
   * }
   */
})();
