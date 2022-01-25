import { randomUUID } from "crypto"
import { z } from "zod"
import db from "db"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const POSTGRES_URL = process.env.POSTGRES_URL 

const gameStates = [ `active`, `finished` ]
const gameTypes = [ `pc`, `friend`, `random` ]
const PostReqData = z.object({
  type: z.enum([ `friend`, `random` ]),
})

export type NewGame = {
  type: typeof PostReqData._type.type
  state: "active"
  uuid: string
  map: string
  turn: string
}

export default async function games( req:BlitzApiRequest, res:BlitzApiResponse ) {
  if (req.method === `POST`) return onPost( req, res )
  if (req.method === `GET`) return onGet( req, res )
  if (req.method === `DELETE`) return onDelete( req, res )
}

async function onPost( req:BlitzApiRequest, res:BlitzApiResponse ) {
  const postReqData = await PostReqData.safeParseAsync( req.body )

  if (!postReqData.success) return res.json({ state:`error`, issues:postReqData.error.issues })

  const newGameData:NewGame = {
    state: `active`,
    uuid: randomUUID(),
    type: postReqData.data.type,
    map: `...|...|...`,
    turn: `circle`,
  }

  const newGame = await db.game.create({ data:newGameData }).catch( () => null )

  if (newGame === null) {
    const err = {
      state: `error`,
      message: `Cannot create game`,
    }

    console.log({ ...err, log:`Error with creating in database` })
    return res.json( err )
  }

  res.json({ state:`success`, game:newGame })
}

async function onGet( req:BlitzApiRequest, res:BlitzApiResponse ) {
  const anyState = req.query.state as string
  const anyType = req.query.type as string

  let state = gameStates.includes( anyState ) ? anyState : undefined
  let type = gameTypes.includes( anyType ) ? anyType : undefined

  const games = await db.game.findMany({ where:{ state, type } }).catch( err => new Error( err ) )

  if (games instanceof Error) {
    const err = {
      state: `error`,
      message: `Cannot load data`,
    }

    console.log({
      ...err,
      logData: {
        message: `Error with querying from database`,
        POSTGRES_URL,
        error: games
      },
    })
    return res.json( err )
  }

  res.json({ state:`success`, games })
}

async function onDelete( req:BlitzApiRequest, res:BlitzApiResponse ) {
  const force = `force` in req.query ? true : false
  const games = await db.game.deleteMany({ where: {
    circle: force ? undefined : null,
    cross: force ? undefined : null,
    state: force ? undefined : { not:`finished` },
  } })

  res.json({ state:`success`, count:games.count })
}
