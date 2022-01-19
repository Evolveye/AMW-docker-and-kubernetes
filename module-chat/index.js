import {WebSocketServer} from "ws"
import dotenv from "dotenv"

const env = dotenv.config().parsed

const wss = new WebSocketServer({
  port: env.PORT,
})

wss.on(`connection`, ws => {
  ws.on(`message`, data => {
    const json = data.toString()
    console.log(`Received data:`, json)

    ws.send(JSON.stringify( `pong` ))
  })
})