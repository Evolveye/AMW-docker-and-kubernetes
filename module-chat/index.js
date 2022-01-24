import { WebSocketServer } from "ws"
import dotenv from "dotenv"
import prismaPkg from "@prisma/client"

const prisma = new prismaPkg.PrismaClient()
const env = dotenv.config().parsed

const wss = new WebSocketServer({
  port: env.PORT,
})

const sockets = []

wss.on( `listening`, () => console.log( `Server running on "ws://localhost:${env.PORT}"` ) )
wss.on( `connection`, ws => {
  const emitToRoom = (roomId, event, data) => sockets.forEach( s => s.data.gameId === roomId && s.ws.send( JSON.stringify({ event, data }) ) )
  const emit = (event, data) => ws.send( JSON.stringify({ event, data }) )
  const wsData = {
    id: `${Math.random()}`.slice( 2, 12 ),
    gameId: null,
    shape: null,
  }

  sockets.push({ ws, data:wsData })

  console.log( `Socket ${wsData.id} joined.\n` )

  ws.on( `close`, async() => {
    sockets.splice( sockets.findIndex( s => s.ws == ws ), 1 )

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
        let game = { turn:`circle`, map:`...|...|...` }

        if (!gameId) {
          wsData.shape = Math.random() > 0.5 ? `circle` : `cross`
          console.log( `No game ID, starting game with PC` )
          console.log( `Drawn socket shape is a ${wsData.shape} now` )
        } else {
          game = await prisma.game.findFirst({ where:{ uuid:gameId } })

          if (!game) {
            console.log( `Game not found` )
            return emit( `joined to the game`, { gameId:null, shape:null } )
          }

          if (game.circle) {
            if (game.cross) {
              console.log( `Game is full` )
            } else {
              console.log( `Circle taken; socket is a cross now` )
              wsData.shape = `cross`
            }
          } else {
            if (game.cross) {
              console.log( `Cross taken; Socket is a circle now` )
              wsData.shape = `circle`
            } else {
              wsData.shape = Math.random() > 0.5 ? `circle` : `cross`
              console.log( `Drawn socket shape is a ${wsData.shape} now` )
            }
          }

          if (gameId && wsData.shape) {
            wsData.gameId = gameId
            await prisma.game.update({ where:{ uuid:gameId }, data:{ [ wsData.shape ]:wsData.id } })
          }
        }

        const joinedGameData = { gameId, shape:wsData.shape, turn:game.turn, map:game.map }

        console.log({ joinedGameData })
        emit( `joined to the game`, joinedGameData )
        break
      }

      case `message`: {
        const retData = {
          shape: wsData.shape,
          content: payload.data,
        }

        emitToRoom( wsData.gameId, `message`, retData )

        break
      }

      case `grab tile`: {
        const { x, y } = payload.data
        const game = await prisma.game.findFirst({ where:{ uuid:wsData.gameId } })
        const map = game.map.split( `|` ).map( chars => chars.split( `` ) )

        if (game.turn !== wsData.shape) return
        if (map[ y ]?.[ x ] === `.`) map[ y ][ x ] = wsData.shape === `circle` ? `O` : `X`

        const newGameMap = map.map( row => row.join( `` ) ).join( `|` )
        const newTurnOf = wsData.shape === `circle` ? `cross` : `circle`
        const finished = !newGameMap.includes( `.` ) ? `.` : [ `X`, `O` ].find( char => false
          || newGameMap.includes( char + char + char )
          || (newGameMap[ 0 ] === char && newGameMap[ 4 ] === char && newGameMap[ 8 ] === char)
          || (newGameMap[ 1 ] === char && newGameMap[ 5 ] === char && newGameMap[ 9 ] === char)
          || (newGameMap[ 2 ] === char && newGameMap[ 6 ] === char && newGameMap[ 10 ] === char)
          || (newGameMap[ 0 ] === char && newGameMap[ 5 ] === char && newGameMap[ 10 ] === char)
          || (newGameMap[ 2 ] === char && newGameMap[ 5 ] === char && newGameMap[ 8 ] === char),
        )

        if (finished) {
          await prisma.game.update({
            where: { uuid:wsData.gameId },
            data: { map:newGameMap, state:`finished`, winner:finished === `.` ? null : wsData.shape },
          })

          emitToRoom( wsData.gameId, `grab tile`, { x, y, tileOf:wsData.shape, newTurnOf } )
          emitToRoom( wsData.gameId, `end` )
        } else {
          await prisma.game.update({
            where: { uuid:wsData.gameId },
            data: { map:newGameMap, turn:newTurnOf },
          })

          emitToRoom( wsData.gameId, `grab tile`, { x, y, tileOf:wsData.shape, newTurnOf } )
        }
        break
      }

      default: console.log( `UNHANDLED` )
    }

    console.log()
  } )
} )
