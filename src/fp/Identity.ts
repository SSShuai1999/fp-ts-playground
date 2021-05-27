import { Functor1 } from "fp-ts/lib/Functor"

export const URI = 'Identity'

export type URI = typeof URI

export class Identity<A> {
  constructor(readonly value: A) {}
}

export interface URI2HKT<A> { }

declare module 'fp-ts/lib/HKT' {
  interface URI2HKT<A> {
    Identity: Identity<A> // maps the key "Identity" to the type `Identity`
  }
}

const map = <A, B>(fa: Identity<A>, f: (a: A) => B): Identity<B> => new Identity(f(fa.value))

// Functor istance
//@ts-ignore
export const identity: Functor1<URI> = {
  URI,
  map
}

