import { useEffect, useRef, useState } from "react"
import useWS from "app/core/hooks/useWS"
import redirect from "app/core/functions/redirect"
import { cn } from "app/core/functions/createClassName"
import Game from "./logic"
import classes from "./.module.css"

const WS_URL = process.env.CHAT_URL ?? ``

export type TicTacToeProps = {
  className?: string
  gameId?: string
}

export default function TicTacToe({ className, gameId }:TicTacToeProps) {
  const gameRef = useRef<Game>()
  const [ shape, setShape ] = useState<"circle" | "cross" | null>(null)
  const ws = useWS( WS_URL, {
    "joined to the game"( payload ) {
      if (payload.gameId !== gameId) return redirect( `/` )

      setShape( payload.shape )
    },
  } )

  const handleCanvas = (canvas:HTMLCanvasElement) => {
    const intervalId = setInterval( () => {
      if (!canvas || !shape) return

      gameRef.current = new Game( canvas, shape )

      clearInterval( intervalId )
    }, 50 )
  }

  useEffect( () => {
    ws?.emit( `join to the game`, gameId )

    return () => gameRef.current?.destroy()
  }, [ gameId ] )

  return (
    <article className={cn( classes.ticTacToe, className )}>
      <div className={classes.canvasColumn}>
        <span className={classes.shapeInfo}>
          Grasz jako <b className={classes.shape}>{!shape ? `...` : (shape === `circle` ? `kółko` : `krzyżyk`)}</b>
        </span>

        <canvas className={classes.canvas} ref={handleCanvas} />
      </div>
    </article>
  )
}
