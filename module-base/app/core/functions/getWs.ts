import getWindow from "../functions/getWindow"

export type EventHandler = (data) => void
export type Events = Partial<{
  onConnect: EventHandler
  onError: EventHandler
  onDisconnect: EventHandler
  [key:string]: EventHandler
}>
export type EnchancedWebSocket = WebSocket & {
  emit: (event:string, data:unknown) => void
  rmListener: (event:string) => boolean
}
export type EventsStorage = Record<string, EventHandler[]>
export type StorageValue = {
  ws: EnchancedWebSocket
  events: EventsStorage
}

const wsStorage = new Map<string, StorageValue>()

export default function getWs( url:string, events:Events ) {
  const window = getWindow()

  if (!window) return null

  let ws:EnchancedWebSocket

  if (wsStorage.has( url )) {
    const storage = wsStorage.get( url )!

    Object.entries( events ).forEach( ([ k, f ]) => {
      if (!(k in storage.events)) storage.events[ k ] = []

      storage.events[ k ]!.push( f! )
    } )

    ws = storage.ws

    console.log( ws )

    if (events.onConnect && ws.readyState === ws.OPEN) events.onConnect( undefined )
    if (events.onDisconnect && ws.readyState === ws.CLOSED) events.onDisconnect( undefined )
  } else {
    const partialWs:Partial<EnchancedWebSocket> = new window.WebSocket( url )

    partialWs.addEventListener!( `open`, () => wsStorage.get( url )?.events[ `onConnect` ]?.forEach( f => f( undefined ) ) )
    partialWs.addEventListener!( `error`, () => wsStorage.get( url )?.events[ `onError` ]?.forEach( f => f( undefined ) ) )
    partialWs.addEventListener!( `close`, () => wsStorage.get( url )?.events[ `onDisconnect` ]?.forEach( f => f( undefined ) ) )
    partialWs.addEventListener!( `message`, ({ data:rawPayload }) => {
      const events = wsStorage.get( url )?.events

      if (!events) return

      const payload = JSON.parse( rawPayload )

      if (typeof payload !== `object`) return
      if (!(`event` in payload) || !(`data` in payload)) return

      events[ payload.event ]?.forEach( f => f( payload.data ) )
    } )

    partialWs.emit = (event, data) => ws?.send!( JSON.stringify({ event, data }) )
    partialWs.rmListener = event => {
      const handler = events[ event ]

      if (!handler) return false

      wsStorage.get( url )?.events[ event ]?.filter( f => f !== handler )

      return true
    }

    ws = partialWs as EnchancedWebSocket

    wsStorage.set( url, { ws, events:Object.entries( events ).reduce( (obj, [ k, f ]) => ({ ...obj, [ k ]:[ f ] }), {} ) } )
  }

  return ws
}

