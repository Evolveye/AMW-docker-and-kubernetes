import { StateValue, useStaeObject } from "app/core/hooks/useStateObject"
import { InputHTMLAttributes, useCallback } from "react"
import { registerTextInput } from "./inputs/text"

export enum InputType {
  TEXT,
}

export type FormData = StateValue
export type FormActions = {
  registerInput: (name:string, type?:InputType) => InputHTMLAttributes<HTMLInputElement>
}

export default function useForm(): [ FormData, FormActions ] {
  const [ data, setData ] = useStaeObject()
  const registerInput = useCallback( (name:string, type:InputType = InputType.TEXT) => {
    setData({ [ name ]:null })

    switch (type) {
      case InputType.TEXT: return registerTextInput( name )
    }
  }, [] )

  return [ data, { registerInput } ]
}
