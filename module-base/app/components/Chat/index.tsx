import { useMemo } from "react"
import getWindow from "app/core/functions/getWindow"
import classes from "./.module.css"

const WS_URL = process.env.CHAT_URL

export type ChatProps = {
  className?: string
}

export default function Chat({ className }:ChatProps) {
  const ws = useMemo( () => createWS(), [] )
  const send = data => ws?.send( JSON.stringify( data ) )

  return (
    <article className={className}>
      <h3 className={classes.title}>Czat</h3>
    </article>
  )
}

function createWS() {
  const window = getWindow()

  if (!window) return null
  if (typeof WS_URL !== `string`) throw `WS url should by a string`

  const ws = new window.WebSocket( WS_URL )

  ws.onmessage = ({ data }) => console.log( JSON.parse( data ) )

  return ws
}
