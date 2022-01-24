import useFetch from "app/core/hooks/useFetch"
import getDate from "app/core/functions/getDate"
import { cn } from "app/core/functions/createClassName"
import Link from "app/core/components/Link"
import classes from "./.module.css"

export type GamesListProps = {
  className?: string
  state?: "active" | "finished"
  type?: "pc" | "friend" | "random"
  noJoin?: boolean
}
export type Game = {
  id: number
  createdAt: string
  updatedAt: string
  uuid: string
  state: "active" | "finished"
  type: "pc" | "friend" | "random"
  winner: string
  circle: string
  cross: string
}
export type GameFetchRes = {
  state: "success" | "error"
  games: Game[]
}

export default function GamesList({ className, state, type, noJoin = false }:GamesListProps) {
  const gamesList:GameFetchRes | null = useFetch( `GET`, `/api/games`, { state, type } )

  return gamesList === null ? <article className={className} /> : (
    <article className={cn( classes.gamesList, className )}>
      <h3 className={classes.title}>Lista gier</h3>

      <div>
        {
          gamesList?.games?.map( g => {
            if (g.type === `friend`) return (
              <div key={g.id} className={classes.item}>
                <time className={classes.time}>{getDate( g.updatedAt )}</time>

                <span className={classes.winner}>
                  {g.state === `active` ? `Trwa...` : (g.winner ? `Zwycięzki kształt: ${g.winner === `circle` ? `kółko` : `krzyżyk`}` : `Remis`)}
                </span>
              </div>
            )

            if (g.type === `random`) return (
              <div key={g.id} className={classes.item}>
                <time className={classes.time}>{getDate( g.updatedAt )}</time>

                <span className={classes.winner}>
                  {g.state === `active` ? `Trwa...` : (g.winner ? `Zwycięzki kształt: ${g.winner === `circle` ? `kółko` : `krzyżyk`}` : `Remis`)}
                </span>

                {!noJoin && g.state !== `finished` && <Link to={`/game/${g.uuid}`}>{g.circle && g.cross ? `Obserwuj` : `Dołącz`}</Link>}
              </div>
            )
          } )
        }
      </div>
    </article>
  )
}
