import { BlitzPage } from "blitz"
import TicTacToe from "app/components/TicTacToe"
import GamesList from "app/components/GamesList"
import Chat from "app/components/Chat"
import classes from "./game.module.css"

const GameWithPcPage:BlitzPage = () => {
  return (
    <main className={classes.page}>
      <Chat className={classes.chat} />
      <TicTacToe className={classes.ticTacToe} />
      <GamesList className={classes.gamesList} type="random" />
    </main>
  )
}

export default GameWithPcPage
