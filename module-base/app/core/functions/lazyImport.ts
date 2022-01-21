import React from "react"

export default function lazyImport( source:string ) {
  return React.lazy( () => import( source ) )
}
