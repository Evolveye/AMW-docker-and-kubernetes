import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const OWNER_SERVICE_URL = process.env.OWNER_SERVICE_URL

export default async function news( req:BlitzApiRequest, res:BlitzApiResponse ) {
  if (typeof OWNER_SERVICE_URL != `string`) {
    const err = {
      state: `error`,
      message: `News cannot be fetched`,
    }

    console.log({
      ...err,
      logData: {
        message: `Owner service url is not a string`,
        OWNER_SERVICE_URL,
      },
    })
    return res.json( err )
  }

  const newsResponse = await fetch( `${OWNER_SERVICE_URL}api/news` )
    .then( r => r.json() )
    .catch( err => new Error(err) )

  if (!newsResponse || newsResponse instanceof Error) {
    const err = {
      state: `error`,
      message: `News cannot be fetched`,
    }

    console.log({
      ...err,
      logData: {
        message: `Error in news fetching`,
        OWNER_SERVICE_URL,
        error: newsResponse
      },
    })
    return res.json({ ...err })
  }

  res.json({ state:`success`, news:newsResponse.news })
}
