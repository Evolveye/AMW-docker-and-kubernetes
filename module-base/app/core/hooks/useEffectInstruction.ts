import { useEffect } from "react"

export type Executor = () => unknown
export type Dependencies = unknown[]

export default function useEffectInstruction( executor:Executor, dependencies:Dependencies ) {
  useEffect( () => {
    executor()
  }, dependencies )
}
