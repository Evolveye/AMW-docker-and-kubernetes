import { useState } from "react"

export type StateValue = unknown[]
export type Actions<T> = {
  push: (...items:T[]) => void
}

export function useStaeArray<TValue=StateValue>( initialValue = [] ): [StateValue, Actions<TValue>] {
  const [ state, setState ] = useState<TValue[]>( initialValue )

  const actions = {
    push( ...items:TValue[] ) {
      setState( i => [ ...i, ...items ] )
    },
  }

  return [ state, actions ]
}
