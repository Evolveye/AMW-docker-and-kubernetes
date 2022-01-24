import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import GamesList from "app/components/GamesList"
import GameModesChooser from "app/components/GameModesChooser"
import AuthorNews from "app/components/AuthorNews"
import classes from "./index.module.css"

const Home:BlitzPage = () => {
  return (
    <div className={classes.page}>
      <main className={classes.main}>
        <GameModesChooser className={classes.gameModesChooser} />
        <GamesList className={classes.gamesList} type="random" />
      </main>

      <AuthorNews className={classes.authorNews} />
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = page => <Layout title="Home">{page}</Layout>

export default Home
