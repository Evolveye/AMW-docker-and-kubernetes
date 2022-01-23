import { randomUUID } from "crypto"
import { z } from "zod"
import db from "db"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const gameStates = [ `active`, `finished` ]
const PostReqData = z.object({
  type: z.enum([ `friend`, `random` ]),
})

export type NewGame = {
  type: typeof PostReqData._type.type
  state: "active"
  uuid: string
}

export default async function games( req:BlitzApiRequest, res:BlitzApiResponse ) {
  if (req.method === `POST`) return onPost( req, res )
  if (req.method === `GET`) return onGet( req, res )
}

async function onPost( req:BlitzApiRequest, res:BlitzApiResponse ) {
  const postReqData = await PostReqData.safeParseAsync( req.body )

  if (!postReqData.success) return res.json({ state:`error`, issues:postReqData.error.issues })

  const newGameData:NewGame = {
    state: `active`,
    uuid: randomUUID(),
    type: postReqData.data.type,
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

  let state = gameStates.includes( anyState ) ? anyState : undefined

  const games = await db.game.findMany({ where:{ state } }).catch( () => null )

  if (games === null) {
    const err = {
      state: `error`,
      message: `Cannot load data`,
    }

    console.log({ ...err, log:`Error with querying from database` })
    return res.json( err )
  }

  res.json({ state:`success`, games })
}
