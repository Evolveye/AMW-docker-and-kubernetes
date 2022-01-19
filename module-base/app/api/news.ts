import { BlitzApiRequest, BlitzApiResponse } from "blitz";

const OWNER_SERVICE_URL = process.env.OWNER_SERVICE_URL

export default async function news(req:BlitzApiRequest, res:BlitzApiResponse) {
  if (typeof OWNER_SERVICE_URL != `string`) {
    const err = {
      state: `error`,
      message: `News cannot be fetched`,
    }

    console.log({ ...err, log:`Owner service url is not a string` })
    return res.json( err )
  }

  const news = await fetch( `${OWNER_SERVICE_URL}api/news` )
    .then( r => r.json() )
    .catch( () => null )

  if (!news) {
    const err = {
      state: `error`,
      message: `News cannot be fetched`,
    }

    console.log({...err, log:`Error in news fetching` })
    return res.json({ ...err })
  }

  res.json({ state:`success`, news })
}
