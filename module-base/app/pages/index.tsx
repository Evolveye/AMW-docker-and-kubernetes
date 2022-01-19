import { BlitzPage, Link } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useEffect } from "react"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */


const Home: BlitzPage = () => {
  useEffect( ()=>{
    fetch( `/api/news` ).then( r => r.json() ).then( console.log )
  }, [] )

  return (
    <main>
      Hello lab.
      <br />
      <Link href={"/game"}>Game page</Link>
    </main>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
