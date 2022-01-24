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
export type InitialData = {
  shape: "circle" | "cross" | null
  turn: "circle" | "cross" | null
  map: string
}

export default function TicTacToe({ className, gameId }:TicTacToeProps) {
  const gameRef = useRef<Game>()
  const [ initialData, setInitialData ] = useState<InitialData | null>( null )
  const ws = useWS( WS_URL, {
    "joined to the game"( payload ) {
      if (payload.gameId !== gameId) return redirect( `/` )

      setInitialData( payload )
    },

    "change turn"( payload ) {
      gameRef.current?.setTurn( payload.shape )
    },

    "grab tile"( payload ) {
      const { x, y, newTurnOf, tileOf } = payload

      gameRef.current?.setTileShape( x, y, tileOf )
      gameRef.current?.setTurn( newTurnOf )
    },

    "end"( payload ) {
      console.log( payload )
    },
  } )

  const handleCanvas = (canvas:HTMLCanvasElement) => {
    const intervalId = setInterval( () => {
      if (!canvas || !initialData) return
      const { shape, turn, map } = initialData

      gameRef.current = new Game( canvas, {
        shape,
        onTileGrab: (x, y) => ws?.emit( `grab tile`, { x, y } ),
        turn,
        map,
      } )

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
          Grasz jako <b className={classes.shape}>{!initialData ? `...` : (initialData.shape === `circle` ? `kółko` : `krzyżyk`)}</b>
        </span>

        <canvas className={classes.canvas} ref={handleCanvas} />
      </div>
    </article>
  )
}
