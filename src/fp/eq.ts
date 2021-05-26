import { getStructEq } from 'fp-ts/lib/Eq'
import { getEq } from 'fp-ts/lib/Array'
import { contramap } from 'fp-ts/lib/Eq'

export default (() => {
  interface Eq<A> {
    /** returns `true` if `x` is equal to `y` */
    readonly equals: (x: A, y: A) => boolean
  }

  const eqNumber: Eq<number> = {
    equals: (x, y) => x === y
  }

  function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
    return (a, as) => as.some(item => E.equals(item, a))
  }

  elem(eqNumber)(1, [1, 2, 3]) // true
  elem(eqNumber)(4, [1, 2, 3]) // false

  type Point = {
    x: number
    y: number
  }

  // fp 提供了模板
  // const eqPoint: Eq<Point> = {
  //   equals: (p1, p2) => p1.x === p2.x && p1.y === p2.y
  // }

  const eqPoint = getStructEq({
    x: eqNumber,
    y: eqNumber
  })

  const ret = eqPoint.equals({ x: 1, y: 1 }, { x: 1, y: 1 })
  // ret `logs` => `true`
  const eqArrayOfPoints = getEq(eqPoint)
  // eqArrayOfPoints.equals([{ x: 1, y: 1 }],[{ x: 1, y: 1 }]) ret `logs` => `true`

  type User = {
    userId: number
    name: string
  }

  const eqByIncludes = {
    equals: <T extends string, U extends T>(x: T, y: U) => x.includes(y)
  }

  const eqById = {
    equals: (x: number, y: number) => x > y
  }
  
  const eqUser1 = contramap((user: User) => user.name)(eqByIncludes)
  const eqUser2 = contramap((user: User) => user.userId)(eqById)
  
  const or1 = { userId: 100, name: "帅神orz" }
  const or2 = { userId: 101, name: "orz" }

  eqUser1.equals(or1, or2) // `logs` => true
  eqUser2.equals(or1, or2) // `logs` => false

})()


