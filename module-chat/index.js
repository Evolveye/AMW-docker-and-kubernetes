import { WebSocketServer } from "ws"
import dotenv from "dotenv"
import prismaPkg from "@prisma/client"

const prisma = new prismaPkg.PrismaClient()
const env = dotenv.config().parsed ?? process.env

console.log(process.env)

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
    map: ``,
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
          wsData.shape = `circle` // Math.random() > 0.5 ? `circle` : `cross`
          wsData.map = game.map
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

        if (checkTicTacToeEndMap( game.map )) emit( `end` )
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

        if (wsData.gameId) {
          const game = await prisma.game.findFirst({ where:{ uuid:wsData.gameId } })
          const map = game.map.split( `|` ).map( chars => chars.split( `` ) )

          if (game.finished || game.turn !== wsData.shape) return
          if (map[ y ]?.[ x ] === `.`) map[ y ][ x ] = wsData.shape === `circle` ? `O` : `X`

          const newGameMap = map.map( row => row.join( `` ) ).join( `|` )
          const newTurnOf = wsData.shape === `circle` ? `cross` : `circle`
          const finished = checkTicTacToeEndMap( newGameMap )

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
        } else if (wsData.map) {
          console.log( `pc grab` )

          const map = wsData.map
          const mapArr = wsData.map.split( `|` ).map( chars => chars.split( `` ) )
          const playerShape = wsData.shape === `circle` ? `O` : `X`
          const newTurnOf = wsData.shape === `circle` ? `cross` : `circle`
          const pcChar = wsData.shape === `circle` ? `X` : `O`

          if (!mapArr[ y ]?.[ x ] || mapArr[ y ][ x ] !== `.`) return

          mapArr[ y ][ x ] = playerShape
          wsData.map = mapArr.map( row => row.join( `` ) ).join( `|` )

          console.log( `player move`, { map:wsData.map, x, y, tileOf:wsData.shape, newTurnOf } )
          emit( `grab tile`, { x, y, tileOf:wsData.shape, newTurnOf } )

          if (!map.includes( `.` )) return emitToRoom( wsData.gameId, `end` )

          const pcMoveData = makePCMoveOnMap( wsData.map, pcChar )
          console.log( `pc move`, { x:pcMoveData.x, y:pcMoveData.y, tileOf:newTurnOf, newTurnOf:wsData.shape } )

          emit( `grab tile`, { x:pcMoveData.x, y:pcMoveData.y, tileOf:newTurnOf, newTurnOf:wsData.shape } )

          wsData.map = pcMoveData.newMap

          if (checkTicTacToeEndMap( wsData.map )) emit( `end` )
        }

        break
      }

      default: console.log( `UNHANDLED` )
    }

    console.log()
  } )
} )


function checkTicTacToeEndMap( mapStr ) {
  return !mapStr.includes( `.` ) ? `.` : [ `X`, `O` ].find( char => false
    || mapStr.includes( char + char + char )
    || (mapStr[ 0 ] === char && mapStr[ 4 ] === char && mapStr[ 8 ] === char)
    || (mapStr[ 1 ] === char && mapStr[ 5 ] === char && mapStr[ 9 ] === char)
    || (mapStr[ 2 ] === char && mapStr[ 6 ] === char && mapStr[ 10 ] === char)
    || (mapStr[ 0 ] === char && mapStr[ 5 ] === char && mapStr[ 10 ] === char)
    || (mapStr[ 2 ] === char && mapStr[ 5 ] === char && mapStr[ 8 ] === char),
  )
}

function makePCMoveOnMap( map, pcChar ) {
  const randArr = arr => Math.floor( Math.random() * arr.length )
  const mapArr = Array.isArray( map ) ? map : map.split( `|` ).map( chars => chars.split( `` ) )
  let rowI, cellI
  let i = 0

  while (i++ < 100) {
    rowI = randArr( mapArr )
    cellI = randArr( mapArr[ rowI ] )

    if (mapArr[ rowI ][ cellI ] !== `.`) continue

    mapArr[ rowI ][ cellI ] = pcChar

    break
  }

  const newMap = mapArr.map( row => row.join( `` ) ).join( `|` )

  return { x:cellI, y:rowI, newMap }
}
