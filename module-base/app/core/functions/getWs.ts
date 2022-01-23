import getWindow from "../functions/getWindow"

export type EventHandler = (data) => void
export type Payload = {
  event: string
  data: unknown
}
export type Events = Partial<{
  onConnect: EventHandler
  onError: EventHandler
  onDisconnect: EventHandler
  [key:string]: EventHandler
}>
export type EnchancedWebSocket = WebSocket & {
  emit: (event:string, data:unknown) => void
  rmListener: (event?:string) => boolean
  disconnect: () => void
}
export type EventsStorage = Record<string, EventHandler[]>
export type StorageValue = {
  ws: EnchancedWebSocket
  events: EventsStorage
  clients: number
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

    storage.clients++

    if (events.onConnect && ws.readyState === ws.OPEN) events.onConnect( undefined )
    if (events.onDisconnect && ws.readyState === ws.CLOSED) events.onDisconnect( undefined )
  } else {
    const partialWs:Partial<EnchancedWebSocket> = new window.WebSocket( url )
    const queuedEmits:Payload[] = []

    partialWs.addEventListener!( `open`, () => {
      wsStorage.get( url )?.events[ `onConnect` ]?.forEach( f => f( undefined ) )

      queuedEmits.forEach( p => partialWs.emit?.( p.event, p.data ) )
    } )
    partialWs.addEventListener!( `error`, () => wsStorage.get( url )?.events[ `onError` ]?.forEach( f => f( undefined ) ) )
    partialWs.addEventListener!( `close`, () => wsStorage.get( url )?.events[ `onDisconnect` ]?.forEach( f => f( undefined ) ) )
    partialWs.addEventListener!( `message`, ({ data:rawPayload }) => {
      const events = wsStorage.get( url )?.events

      if (!events) return

      const payload = JSON.parse( rawPayload )

      if (typeof payload !== `object`) return
      if (!(`event` in payload)) return
      if (payload.event in events) events[ payload.event ]!.forEach( f => f( payload.data ) )
      else console.warn( `Unhandled event: ${payload.event}` )
    } )

    partialWs.emit = (event, data) => {
      const payload = { event, data }

      if (ws.readyState === ws.OPEN) return ws?.send!( JSON.stringify( payload ) )

      queuedEmits.push( payload )
    }
    partialWs.rmListener = event => {
      if (!event) {
        const storedEvents = wsStorage.get( url )?.events

        if (!storedEvents) return false

        Object.entries( events ).forEach( ([ e, f ]) => storedEvents[ e ]?.filter( g => g !== f ) )

        return true
      }

      const handler = events[ event ]

      if (!handler) return false

      wsStorage.get( url )?.events[ event ]?.filter( f => f !== handler )

      return true
    }
    partialWs.disconnect = () => {
      const storedWs = wsStorage.get( url )

      if (!storedWs) return

      partialWs.rmListener!()
      storedWs.clients--

      if (!storedWs.clients) return

      ws.close()
      wsStorage.delete( url )
    }

    ws = partialWs as EnchancedWebSocket

    wsStorage.set( url, { clients:1, ws, events:Object.entries( events ).reduce( (obj, [ k, f ]) => ({ ...obj, [ k ]:[ f ] }), {} ) } )
  }

  return ws
}

