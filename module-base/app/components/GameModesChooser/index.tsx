import redirect from "app/core/functions/redirect"
import http from "app/core/functions/getHttp"
import { cn } from "app/core/functions/createClassName"
import classes from "./.module.css"

export type GameMode = "pc" | "friend" | "random"
export type GameModesChooserProps = {
  className?: string
}

export type ApiGamesRes = {
  state: "success" | "error"
  game: {
    uuid: string
  }
}

export default function GameModesChooser({ className }:GameModesChooserProps) {
  return (
    <article className={cn( classes.gameModesChooser, className )}>
      <button className={classes.item} onClick={() => runGame( `pc` )}>Gra z komputerem</button>
      <button className={classes.item} onClick={() => runGame( `friend` )}>Gra ze znajomym</button>
      <button className={classes.item} onClick={() => runGame( `random` )}>Gra z losowym przeciwnikiem</button>
    </article>
  )
}


async function runGame( type:GameMode ) {
  if (type === `pc`) return redirect( `/game` )

  const gameRes:ApiGamesRes = await http.post( `/api/games`, { type } )

  if (gameRes.state === `error`) return alert( `Błąd Tworzenia gry. Spróbuj ponownie później` )

  return redirect( `/game/${gameRes.game.uuid}` )
}
