// 在 js 中修改不可变嵌套对象是冗长的。这使得代码难以理解和推理。
// 让我们来看一些例子
interface Street {
  num: number
  name: string
}

interface Address {
  city: string;
  street: Street
}

interface Company {
  name: string
  address: Address
}

interface Employee {
  name: string;
  company: Company
}

// // 假设我们有一个雇员，我们需要大写他的公司街道名称的第一个字符，下面是我们如何用普通的 js 编写它的方法
const employee: Employee = {
  name: 'john',
  company: {
    name: "awesome inc",
    address: {
      city: 'london',
      street: {
        num: 23,
        name: 'high street'
      }
    }
  }
}

// const employeeCapitalized = {
//   ...employee,
//   company: {
//     ...employee.company,
//     address: {
//       ...employee.company.address,
//       street: {
//         ...employee.company.address.street,
//         name: capitalize(employee.company.address.street.name)
//       }
//     }
//   }
// }

import { Lens } from 'monocle-ts'
import * as L from 'monocle-ts/Lens'
import { pipe } from 'fp-ts/function'
import * as O from 'monocle-ts/Optional'
import { some, none } from 'fp-ts/Option'

// const Lens$Company = Lens.fromProp<Employee>()('company')
// const Lens$Address = Lens.fromProp<Company>()('address')
// const Lens$Street = Lens.fromProp<Address>()('street')
// const Lens$Name = Lens.fromProp<Street>()('name')

const capitalize = (s: string): string => s.substring(0, 1).toUpperCase() + s.substring(1)

const capitalizeName = pipe(
  L.id<Employee>(),
  L.prop('company'),
  L.prop('address'),
  L.prop('street'),
  L.prop('name'),
  L.modify(capitalize),
)

// 相同的效果
console.log("capitalizeName", capitalizeName(employee))

const firstLetterOptional: O.Optional<string, string> = {
  getOption: (s) => (s.length > 0 ? some(s[0]) : none),
  set: (a) => (s) => (s.length > 0 ? a + s.substring(1) : s)
}

const firstLetter = pipe(
  L.id<Employee>(),
  L.prop('company'),
  L.prop('address'),
  L.prop('street'),
  L.prop('name'),
  L.composeOptional(firstLetterOptional)
)

// 相同的效果
console.log("firstLetter", pipe(
  firstLetter,
  O.modify((s) => s.toUpperCase())
)(employee))