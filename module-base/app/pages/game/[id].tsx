import { BlitzPage, useParam } from "blitz"
import TicTacToe from "app/components/TicTacToe"
import GamesList from "app/components/GamesList"
import Chat from "app/components/Chat"
import classes from "./game.module.css"

const GameWithPersonPage:BlitzPage = () => {
  const gameId = useParam( `id` ) as string

  return !gameId ? null : (
    <main className={classes.page}>
      <Chat className={classes.chat} />
      <TicTacToe className={classes.ticTacToe} gameId={gameId} />
      <GamesList className={classes.gamesList} />
    </main>
  )
}

export default GameWithPersonPage
