import { WebSocketServer } from "ws"
import dotenv from "dotenv"
import prismaPkg from "@prisma/client"

const prisma = new prismaPkg.PrismaClient()
const env = dotenv.config().parsed

const wss = new WebSocketServer({
  port: env.PORT,
})

wss.on( `listening`, () => console.log( `Server running on "ws://localhost:${env.PORT}"` ) )
wss.on( `connection`, ws => {
  const send = (event, data) => ws.send( JSON.stringify({ event, data }) )
  const wsData = {
    random: `${Math.random()}`.slice( 2, 6 ),
  }

  ws.on( `message`, rawPayload => {
    const payload = JSON.parse( rawPayload.toString() )

    if (typeof payload !== `object`) return
    if (!(`event` in payload)) return

    console.log( `New payload from ${wsData.random}:\n`, payload )

    switch (payload.event) {
      case `join`: {
        break
      }

      case `message`: {
        const retData = {
          random: wsData.random,
          content: payload.data,
        }

        send( `message`, retData )
        break
      }

      default: console.log( `UNHANDLED` )
    }

    console.log()
  } )
} )
