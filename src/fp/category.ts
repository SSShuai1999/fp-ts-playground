/**
 * category
 */
import { Option, isNone, none, some } from "fp-ts/lib/Option";
import { Task } from "fp-ts/lib/Task";

export default (() => {
  /**
   * 我们已经看到了函数式编程中使用的一些基础抽象：Eq、Ord、Semigroup 和 Monoid
   * 我们接下来将探索一些使函数式编程更加有趣的高级抽象
   * 从历史上来看，fp-ts 中包含的第一个高级抽象是 Functor, 但在讨论转换函数之前，我们需要了解一些关于类别的知识。
   * 函数式编程的基石是组合，但这到底意味这什么呢？ 什么时候我们可以说有两件事是合成的？我们什么时候可以说事情安排得很好呢？
   * 我们需要一个组合的正式定义，这就是分类的意义所在。
   *
   * 类别抓住了组合的本质
   */

  /**
   * Categories 类别
   * 类别的定义有点长，所以我把它的定义分为两部分：
   * 第一个是技术性的（首先我们需要定义其组成成分）。
   * 第二部分将包含我们最感兴趣的内容：组合的概念
   */

  /**
   * Part I 第一部分定义
   * 范畴是一对（Objects，orphisms）（物体，态射） 其中
   * Objects is a collection of objects
   * Morphisms is a collection of morphisms (or arrows) between the objects
   *
   * Objects 是集合对象
   * Morphisms 是集合的形态
   *
   * 注意：这里的术语 "object" 与 OOP 没有任何关系，您可以将对象看作是您无法检查的黑盒，或者甚至是某种形态变化的辅助占位符。
   * 每个太社都有一个源对象 a 和一个目标对象 b ，其中 a 和 b 在对象中。
   * 我们写：f: a ⟼ b，我们说 "f 是从 a 到 b 的态射"。
   */

  /**
   * Part II （Composition） 第二部分（组合）
   * 有一个名为 "compoentiation" 的 components 操作，它必须包含以下属性
   * （composition of morphisms 态射构成）
   * f: A ⟼ B 及 g: B ⟼ C 是两种形态 Morphisms 。那么它一定存在第三种形态。 g ∘ f: A ⟼ C
   *
   * (associativity 结合性) if f: A ⟼ B, g: B ⟼ C and 及h: C ⟼ D then 然后h ∘ (g ∘ f) = (h ∘ g) ∘ f
   * (identity 同一性) 对于每个物体 X 。存在这形态变异。 X ⟼ X 我们叫做 X 的同态。
   * f: A ⟼ X g: X ⟼ B
   * identity ∘ f = f 和 g ∘ identity = g.
   *
   * 我们来举个例子
   *
   *  1A    f     1B
   *    A  ⟼⟼   B
   *     \        ↓
   *       \      ↓
   *  g ∘ f  \    ↓ g
   *           \  ↓
   *              C
   *              1C
   *
   * 这个范畴很简单，只有三个对象和六个态射（1A, 1B, 1C 是 A, B, C 的单位态射）。
   */

  /**
   * 作为编程语言的分类
   * 一个类别可以被解释为一个类型化编程语言的简化模型，其中：
   * objects 是 types 类型
   * morphisms 是 functions 函数
   * ∘ 是 function composition 复合函数
   *
   *  1A    f     1B
   *    A  ⟼⟼   B
   *     \        ↓
   *       \      ↓
   *  g ∘ f  \    ↓ g
   *           \  ↓
   *              C
   *              1C
   *
   * 以上可以为被解释为一个相当简单的，令人难以置信的编程语言，只有三种类型和一小堆函数。
   * 让我们冷静思考下！然后 ╰(*°▽°*)╯欢呼！雀跃
   *
   * A = string
   * B = number
   * C = boolean
   * f = string => number
   * g = number => boolean
   * g ∘ f = string => boolean
   *
   * 实现可以是这样的
   */

  function f(s: string): number {
    return s.length;
  }

  function g(n: number): boolean {
    return n > 2;
  }

  // 组合函数 = g ∘ f
  function h(s: string): boolean {
    return g(f(s));
  }

  /**
   * Examples1
   */
  function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
    return (a) => g(f(a));
  }

  compose(g, f); // type = boolean

  /**
   * Examples2
   */
  const composeAPI = <A, B, C>(
    f: (a: A) => B,
    g: (b: B) => C
  ): ((a: A) => C) => {
    return (a: A) => g(f(a));
  };

  const A = (a: string) => a.length;
  const B = (b: number) => b === 0;

  composeAPI(A, B)("1"); // logs => `false`

  /**
   * Examples2 （F = Array）
   */
  function lift1<B, C>(g: (b: B) => C): (fb: Array<B>) => Array<C> {
    return (fb) => fb.map(g);
  }

  /**
   * Examples3 （F = Option)
   */
  function lift2<B, C>(g: (b: B) => C): (fb: Option<B>) => Option<C> {
    return (fb) => (isNone(fb) ? none : some(g(fb.value)));
  }

  /**
   * Examples4 （F = Task)
   */
  function lift3<B, C>(g: (b: B) => C): (fa: Task<B>) => Task<C> | Promise<C> {
    return (fb) => fb().then(g);
  }
})();
