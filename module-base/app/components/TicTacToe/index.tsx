import { useEffect, useRef, useState } from "react"
import useWS from "app/core/hooks/useWS"
import redirect from "app/core/functions/redirect"
import { cn } from "app/core/functions/createClassName"
import Link from "app/core/components/Link"
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
  const [ finished, setFinished ] = useState<boolean>( false )
  const [ error, setError ] = useState<boolean>( false )
  const [ initialData, setInitialData ] = useState<InitialData | null>( null )
  const ws = useWS( WS_URL, {
    "onError"() {
      setError( true )
    },

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

    "end"() {
      setFinished( true )
    },
  } )

  const handleCanvas = (canvas:HTMLCanvasElement) => {
    const intervalId = setInterval( () => {
      if (!canvas || !initialData) return

      if (gameRef.current) {
        return gameRef.current.replaceCanvas( canvas )
      }

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
          {
            finished ? (
              <>Gra zakończona. <Link to="/">Powrót do strony głównej</Link></>
            ) : (
              <>Grasz jako <b className={classes.shape}>{!initialData ? `...` : (initialData.shape === `circle` ? `kółko` : `krzyżyk`)}</b></>
            )
          }
        </span>

        <canvas className={classes.canvas} ref={handleCanvas} />
      </div>
    </article>
  )
}
