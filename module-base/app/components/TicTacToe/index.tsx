import useWS from "app/core/hooks/useWS"
import { cn } from "app/core/functions/createClassName"
import classes from "./.module.css"

const WS_URL = process.env.CHAT_URL ?? ``

export type TicTacToeProps = {
  className?: string
  gameId?: string
}

export default function TicTacToe({ className, gameId }:TicTacToeProps) {
  const ws = useWS( WS_URL, {
    onConnect: () => {
      setTimeout( () => ws?.emit( `join to the game`, gameId ), 0 )
    },
  } )

  return (
    <article className={cn( classes.ticTacToe, className )}>
      <canvas className={classes.canvas} />
    </article>
  )
}
