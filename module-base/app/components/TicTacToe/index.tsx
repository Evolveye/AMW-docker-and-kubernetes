import { cn } from "app/core/functions/createClassName"
import classes from "./.module.css"

export type TicTacToeProps = {
  className?: string
}

export default function TicTacToe({ className }:TicTacToeProps) {
  return (
    <article className={cn( classes.ticTacToe, className )}>
      <canvas className={classes.canvas} />
    </article>
  )
}
