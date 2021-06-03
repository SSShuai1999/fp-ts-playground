/**
 * Monad
 */

import { Option, some, none, option, isNone } from "fp-ts/lib/Option";
import { head, flatten } from "fp-ts/lib/Array";

export default (() => {
  /**
   * 在上一篇文章中，我们看到只要 m-ary 允许一个应用函子实例，我们就可以通过提升 g 来构造一个纯 n 元程序 g 的有效程序 f: (a: A) => M<B>
   */

  /**
   * 然而，我们必须解决最后一个问题: 如果两个程序都有效呢？
   *
   * f: (a: A) => M<B>
   * f: (b: B) => M<C>
   *
   * 这样的 f 和 g 的 ”组成“ 是什么
   * 为了处理这最后一种情况，我们需要一些比 Functor 更强大的东西，因为它很容易以嵌套上下文结束
   */

  /**
   * The problem：nested contexts 嵌套上下文
   * 为了跟好地解释为什么我们需要更多的东西，让我们看一些例子
   */

  /**
   * Example(M = Array)
   * 假设我们想要检索 Twitter 用户的关注者
   */

  interface User {
    followers: Array<User>;
  }

  const getFollowers = (user: User): Array<User> => user.followers;

  //@ts-ignore
  declare const user: User;

  const followersOfFollowers1: Array<Array<User>> =
    getFollowers(user).map(getFollowers);

  /**
   * 这里有一些问题，follwersOfFollowers 类型为 Array<Array<User>>，但是我们需要 Array<User>
   * 我们需要压平嵌套的数组
   * 扁平化： <A>(mma: Array<Array<A>>) => Array<A> 函数由 fp-ts 导出，这样就方便了
   */

  const followersOfFollowers2: Array<User> = flatten(
    getFollowers(user).map(getFollowers)
  );

  /**
   * 很好，那么其他的数据类型呢？
   */

  /**
   * Example(M = Option)
   * 假设我们想计算一个数值列表头部的倒数
   */
  const inverse = (n: number): Option<number> => (n === 0 ? none : some(1 / n));

  const inverseHead: Option<Option<number>> = option.map(
    head([1, 2, 3]),
    inverse
  );

  /**
   * Opss，我又做了一次， Option<Option<number>> -> Option<number>
   */

  const flatten2 = <A>(mma: Option<Option<A>>): Option<A> =>
    isNone(mma) ? none : mma.value;

  const inverseHead: Option<number> = flatten(
    option.map(head([1, 2, 3]), inverse)
  );
})();
