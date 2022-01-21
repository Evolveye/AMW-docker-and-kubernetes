import Express from "express"
import dotenv from "dotenv"
import news from "./news.js"

const env = dotenv.config().parsed

const app = Express()

app.use( (req, _, next) => next( console.log( req.method, `::`, req.url ) ) )

app.get( `/api/news`, (req, res) => {
  res.json({ state:`ok`, news })
} )

app.listen( env.PORT, () => console.log( `Server running on "http://localhost:${env.PORT}"` ) )
