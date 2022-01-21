import { useEffect, useState } from "react"
import http, { Method } from "../functions/getFetch"

export default function useFetch( method:Method, uri:string, data:Record<string, string | number> ) {
  const [ response, setResponse ] = useState<null | Response>( null )

  useEffect( () => {
    const pendingRequest = (() => {
      switch (method) {
        case `GET`: return http.get( uri, data )
        case `POST`: return http.post( uri, data )
      }
    })()

    pendingRequest.then( setResponse )
  }, [] )

  return response
}
