import getWindow from "app/core/functions/getWindow";
import { BlitzPage } from "blitz";
import { useEffect, useMemo } from "react";

const WS_URL = process.env.CHAT_URL

const GamePage:BlitzPage = () => {
  const ws = useMemo( () => createWS(), [])
  const send = data => ws?.send( JSON.stringify( data ) )

  useEffect( ()=>{
    fetch( `/api/games/finished` ).then( r => r.json() ).then( console.log )
  }, [] )

  return (
    <main>
      Game page
      <br/>
      <button onClick={() => send(`ping`)}>Ping to console</button>
    </main>
  )
}

export default GamePage

function createWS() {
  const window = getWindow()

  if (!window) return null
  if (typeof WS_URL !== `string`) throw `WS url should by a string`

  const ws = new window.WebSocket( WS_URL )

  ws.onmessage = ({ data }) => console.log( JSON.parse( data ) )

  return ws
}