import { useState } from "react"

export type StateValue = Record<string, unknown>
export type SetterValue = StateValue | ((prevValue:StateValue) => StateValue)
export type Setter = (param:SetterValue) => void

export function useStaeObject( initialValue = {} ): [StateValue, Setter] {
  const [ state, setState ] = useState<StateValue>( initialValue )

  const setStateObject:Setter = param => {
    if (typeof param === `function`) {
      setState( prevObj => param( prevObj! ) )
    } else if (typeof param === `object` && !Array.isArray( param )) {
      setState( prevObj => ({ ...prevObj, ...param }) )
    }
  }

  return [ state, setStateObject ]
}
