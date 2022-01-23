import { useEffect } from "react"
import { BlitzPage, useParam } from "blitz"
import TicTacToe from "app/components/TicTacToe"
import GamesList from "app/components/GamesList"
import Chat from "app/components/Chat"
import classes from "./game.module.css"

const GameWithPersonPage:BlitzPage = () => {
  // const gameId = useParam( `id` )

  useEffect( () => {
    fetch( `/api/games/finished` ).then( r => r.json() ).then( console.log )
  }, [] )

  return (
    <main className={classes.page}>
      <Chat className={classes.chat} />
      <TicTacToe className={classes.ticTacToe} />
      <GamesList className={classes.gamesList} />
    </main>
  )
}

export default GameWithPersonPage
