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
  const emit = (event, data) => ws.send( JSON.stringify({ event, data }) )
  const wsData = {
    id: `${Math.random()}`.slice( 2, 12 ),
    gameId: null,
    shape: null,
  }

  console.log( `Socket ${wsData.id} joined.\n` )

  ws.on( `close`, async() => {
    const game = await prisma.game.update({ where:{ uuid:wsData.gameId }, data:{ [ wsData.shape ]:null } }).catch( () => null )
    const shouldDelete = game && !game.cross && !game.circle && game.state !== `finished`

    console.log( `Socket ${wsData.id} left.`, shouldDelete ? `Game "${wsData.gameId}" deleted` : ``, `\n` )

    if (shouldDelete) await prisma.game.delete({ where:{ uuid:wsData.gameId } })
  } )

  ws.on( `message`, async rawPayload => {
    const payload = JSON.parse( rawPayload.toString() )

    if (typeof payload !== `object`) return
    if (!(`event` in payload)) return

    console.log( `New payload from ${wsData.id}:\n`, payload )

    switch (payload.event) {
      case `join to the game`: {
        const gameId = payload.data

        if (!gameId) {
          wsData.shape = Math.random() > 0.5 ? `circle` : `cross`
          console.log( `No game ID, starting game with PC` )
          console.log( `Drawn socket shape is a ${wsData.shape} now` )
        } else {
          const game = await prisma.game.findFirst({ where:{ uuid:gameId } })

          if (!game) {
            console.log( `Game not found` )
            return emit( `joined to the game`, { gameId:null, shape:null } )
          }

          if (game.circle) {
            if (game.cross) {
              console.log( `Game is full` )
            } else {
              console.log( `Socket is a cross now` )
              wsData.shape = `cross`
            }
          } else {
            if (game.cross) {
              console.log( `Socket is a circle now` )
              wsData.shape = `circle`
            } else {
              wsData.shape = Math.random() > 0.5 ? `circle` : `cross`
              console.log( `Drawn socket shape is a ${wsData.shape} now` )
            }
          }

          if (gameId && wsData.shape) {
            wsData.gameId = gameId
            prisma.game.update({ where:{ uuid:gameId }, data:{ [ wsData.shape ]:wsData.id } })
          }
        }

        emit( `joined to the game`, { gameId, shape:wsData.shape } )
        break
      }

      case `message`: {
        const retData = {
          shape: wsData.shape,
          content: payload.data,
        }

        emit( `message`, retData )
        break
      }

      default: console.log( `UNHANDLED` )
    }

    console.log()
  } )
} )
