import { useEffect, useMemo, useState } from "react"
import getWs, { Events } from "../functions/getWs"

export default function useWS( url:string, events:Events ) {
  const [ , setReadyState ] = useState( 0 )
  const ws = useMemo( () => getWs( url, {
    ...events,
    onConnect( arg ) {
      setTimeout( () => {
        setReadyState( ws!.readyState )
        events.onConnect?.( arg )
      }, 0 )
    },
    onError( arg ) {
      setTimeout( () => {
        setReadyState( ws!.readyState )
        events.onError?.( arg )
      }, 0 )
    },
    onDisconnect( arg ) {
      setTimeout( () => {
        setReadyState( ws!.readyState )
        events.onDisconnect?.( arg )
      }, 0 )
    },
  } ), [] )


  useEffect( () => () => ws?.disconnect(), [] )


  return ws
}
