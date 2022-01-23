import { WebSocketServer } from "ws"
import dotenv from "dotenv"

const env = dotenv.config().parsed

const wss = new WebSocketServer({
  port: env.PORT,
})

wss.on( `listening`, () => console.log( `Server running on "ws://localhost:${env.PORT}"` ) )
wss.on( `connection`, ws => {
  const wsData = {
    random: `${Math.random()}`.slice( 2, 6 ),
  }

  ws.on( `message`, data => {
    const receivedData = data.toString()
    const message = typeof receivedData === `string` ? receivedData.slice( 1, -1 ) : receivedData

    console.log( `${wsData.random} send message: ${message}` )

    const retData = {
      random: wsData.random,
      content: message,
    }

    ws.send( JSON.stringify( retData ) )
  } )
} )
