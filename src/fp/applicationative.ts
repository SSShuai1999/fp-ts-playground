/**
 * appicationative
 */

import { Functor } from "fp-ts/lib/Functor";
import { HKT } from "fp-ts/lib/HKT";
import { flatten, Apply } from "fp-ts/lib/Array";
import { isNone, none, Option } from "fp-ts/lib/Option";
import { some } from "fp-ts/lib/ReadonlyRecord";
import { Task } from "fp-ts/lib/Task";

export default (() => {
  /**
   * Curry
   * 首先，我们必须为一个函数建模，改函数接受两个参数，比如类型 B和 C（我们可以使用数组），并返回类型 D 的值
   * g: (args: [B, C]) => D
   */

  /**
   * 我们可以使用一种叫做 currying 的技术来重写 g
   * Curring 是一种技术，它将一个函数的求值转换为一个函数序列的求知，每个函数都有一个参数。例如，一个函数接受两个参数，
   * 一个来自 B， 一个来自 C，通过局部套用生成 D 类型的输出，这个函数被转换成一个函数，该函数接受一个来自 c 的参数，并作为输出函数从 B 生成到 C 。
   * 我们可以将 g 重写为：
   * g: (b: B) => (c: C) => D
   * 我们需要一个提升操作，不要称之为 liftA2，以便与旧的提升操作区分开来，后者输出一个具有以下签名的函数
   * liftA2(g): (fb: F<B>) => (fc: F<C>) => F<D>
   *
   * 我们如何才能到达目标呢？ 因为 g 现在是一元的，我们可以使用函子实例和我们的旧 lift
   * lift(g): (fb: F<B>) => F<(c: C) => D>
   * 现在我们陷入了困境：对函数实例没有合法的操作，这个函数实例能够将值 f<(c: C) => D> unzip 为一个函数 (fc: F<C>) => F<D>
   */

  /**
   * Apply
   * 让我们引入一个新的抽象 Apply，它拥有这样一个拆封操作（名为 ap）
   */

  interface Apply<F> extends Functor<F> {
    ap: <C, D>(fcd: HKT<F, (c: C) => D>, fc: HKT<F, C>) => HKT<F, D>;
  }

  /**
   * ap 函数基本上是用重新排列的参数 unzip 的。
   * unpack: <C, D>(fcd: HKT<F, (c: C) => D>) => ((fc: HKT<F, C>) => HKT<F, D>)
   * ap:     <C, D>(fc: HKT<F, (c: C) => D), fc: HKT<F, C>) => HKT<F, D>
   * 因此 ap 可以从 unpack （和 viceversa） 派生。
   * HKT 类型是 fp-ts 标识通用型别构造器的方法（一种在 Lightwight higher-kinded polymorphism 论文中提出的技术）
   * 因此当你看到 HKT<F, X> 时，实际上就是应用于 x 类型的型别构造器 F (i.e. F<X>)
   * 此外，如果存在能够将 A 型值提升到 F<A> 型值的操作，那么这将是很方便的。这样，我们可以通过提供 F<B> 和 F<C> 类型的参数或者通过提升 B 和 C 类型的值来调用 liftA2(g) 的函数
   * 因此，让我们来介绍构建在 Apply 之上并拥有这样的操作(命名为 of) 的抽象
   */

  interface Applicative<F> extends Apply<F> {
    of: <A>(a: A) => HKT<F, A>;
  }

  interface Applicative<F> extends Apply<F> {
    of: <A>(a: A) => HKT<F, A>;
  }

  /**
   * 让我们看看一些常见数据类型的 applicationative 实例
   */

  /**
   * Examle (F = Array)
   */

  const applicativeArray = {
    map: <A, B>(fa: Array<A>, f: (a: A) => B): Array<B> => fa.map(f),
    of: <A>(a: A): Array<A> => [a],
    ap: <A, B>(fab: Array<(a: A) => B>, fa: Array<A>): Array<B> =>
      flatten(fab.map((f) => fa.map(f))),
  };

  /**
   * Examle (F = Option)
   */
  const applicativeOption = {
    map: <A, B>(fa: Option<A>, f: (a: A) => B): Option<B> =>
      //@ts-ignore
      isNone(fa) ? none : some(f(fa.value)),

    //@ts-ignore
    of: <A>(a: A): Option<A> => some(a),
    ap: <A, B>(fab: Option<(a: A) => B>, fa: Option<A>): Option<B> =>
      isNone(fab) ? none : applicativeOption.map(fa, fab.value),
  };

  /**
   * Examle (F = Task)
   */
  const applicativeTask = {
    map:
      <A, B>(fa: Task<A>, f: (a: A) => B): Task<B> =>
      () =>
        fa().then(f),
    of:
      <A>(a: A): Task<A> =>
      () =>
        Promise.resolve(a),
    ap:
      <A, B>(fab: Task<(a: A) => B>, fa: Task<A>): Task<B> =>
      () =>
        Promise.all([fab(), fa()]).then(([f, a]) => f(a)),
  };

  /**
   * lifting
   * 那么，给定一个 Apply for F 的实例，我们现在可以编写 liftA2 吗？
   */
  type Curried2<B, C, D> = (b: B) => (c: C) => D;

  function liftA2<F>(
    F: Apply<F>
  ): <B, C, D>(
    g: Curried2<B, C, D>
  ) => Curried2<HKT<F, B>, HKT<F, C>, HKT<F, D>> {
    return (g) => (fb) => (fc) => F.ap(F.map(fb, g), fc);
  }

  /**
   * 很好，但是有三个参数的函数呢？我们还需要另一个抽象吗？
   * 好消息是答案是否定的，应用就足够了
   */
  type Curried3<B, C, D, E> = (b: B) => (c: C) => (d: D) => E;

  function liftA3<F>(
    F: Apply<F>
  ): <B, C, D, E>(
    g: Curried3<B, C, D, E>
  ) => Curried3<HKT<F, B>, HKT<F, C>, HKT<F, D>, HKT<F, E>> {
    return (g) => (fb) => (fc) => (fd) => F.ap(F.ap(F.map(fb, g), fc), fd);
  }

  /**
   * 实际上，给定一个 Apply 实例，我们可以为每一个 n 写一个 liftAn 函数
   * 注意，liftA1只是一个接触函子运算
   * 我们现在可以更新我们的 "composition table" 了
   *
   * Program f        Program g       Composition
   * -----------------------------------------------------
   * pure             pure            g ∘ f
   * -----------------------------------------------------
   * effectful        pure, n-ary     liftAn(g) ∘ f
   * -----------------------------------------------------
   */
})();
