import { Option, none, some, fromNullable } from 'fp-ts/Option'
import { Either, tryCatch } from 'fp-ts/Either'
import { IO } from 'fp-ts/IO'

export default (() => {
  const data1 = ['1', 2, 3, 4]
  const data2 = [{ type: "🍇", commit: "👍🏿" },{ type: "🥕", commit: "😭" }]


  /**
   * 可能失败并返回代码域的特殊值的 API。
   */
   function findIndex<A>(
    as: Array<A>,
    predicate: (a: A) => boolean
  ): Option<number> {
    const index = as.findIndex(predicate)
    return index === -1 ? none : some(index)
  }

  findIndex(data1, (s) => s === '1') // logs -> { _tag: "Some", value: 0 }

  /**
   * 用例: 可能失败并返回未定义(或 null)的 API。
   */
  function find<A>(as: Array<A>, predicate: (a: A) => boolean): Option<A> {
    return fromNullable(as.find(predicate))
  }
 
  find(data2, (item) => item.commit === '😍')  // logs -> { _tag: "None" }


  /**
   * 用例: 一个可能抛出。
   */
  function parse(s: string): Either<Error, unknown> {
    return tryCatch(
      () => JSON.parse(s),
      (reason) => new Error(String(reason))
    )
  }

  parse("{\"name\":\"帅神orz\"}") // ok

  
  /**
   * 用例: 返回不确定值的 API。
   */
  const random: IO<number> = () => Math.random()

  console.log(random())


})()