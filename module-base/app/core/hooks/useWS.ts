import { useEffect, useMemo, useState } from "react"
import getWindow from "../functions/getWindow"

export type UseWsConfig = {
  onMessage: (data) => void
}

export default function useWS( url:string, { onMessage }:UseWsConfig ) {
  const ws = useMemo( () => {
    const window = getWindow()

    if (!window) return null

    const ws = new window.WebSocket( url )

    if (onMessage) ws.onmessage = ({ data }) => onMessage( JSON.parse( data ) )

    return ws
  }, [] )


  const [ , setReadyState ] = useState( ws?.readyState ?? 0 )


  useEffect( () => {
    if (!ws) return

    const updateReadyState = () => setReadyState( ws.readyState )

    ws.onopen = () => updateReadyState()
    ws.onerror = () => updateReadyState()
    ws.onclose = () => updateReadyState()
  }, [ ws ] )


  return ws
}
