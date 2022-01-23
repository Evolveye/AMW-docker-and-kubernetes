import { useEffect, useState } from "react"
import http, { Method } from "../functions/getHttp"

export default function useFetch<T>( method:Method, uri:string, data:Record<string, string | number | undefined | null> = {} ) {
  const [ response, setResponse ] = useState<null | T>( null )

  useEffect( () => {
    const pendingRequest = (() => {
      switch (method) {
        case `GET`: return http.get( uri, data )
        case `POST`: return http.post( uri, data )
      }
    })()

    pendingRequest?.then( setResponse )
  }, [] )

  return response
}
