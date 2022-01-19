import { BlitzApiRequest, BlitzApiResponse } from "blitz";
import db from "db";

export default async function finishedGames(req:BlitzApiRequest, res:BlitzApiResponse) {
  const games = await db.game.findMany({ where:{ state:`ended` }})

  res.json({ state:`success`, games })
}
