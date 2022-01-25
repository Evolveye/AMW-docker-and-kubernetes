import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const CHAT_URL = process.env.CHAT_URL

export default async function ws( _:BlitzApiRequest, res:BlitzApiResponse ) {
  if (!CHAT_URL) {
    const err = {
      state: `error`,
      message: `Cannot establish WS connection`,
    }

    console.log({
      ...err,
      logData: {
        message: `Something wrong with ws url`,
        CHAT_URL,
      },
    })

    return res.status( 500 ).json( err )
  }

  // TODO Here should be WS proxy
  res.json({ state:`success`, wsUrl:CHAT_URL })
}
