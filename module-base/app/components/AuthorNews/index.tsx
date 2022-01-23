import useFetch from "app/core/hooks/useFetch"
import { cn } from "app/core/functions/createClassName"
import classes from "./.module.css"


export type AuthorNewsProps = {
  className?: string
}
export type News = {
  title: string
  body: string
}

export type NewsResponse = {
  state: `success` | `error`
  news: News[]
}

export default function AuthorNews({ className }:AuthorNewsProps) {
  const newsResponse = useFetch<NewsResponse>( `GET`, `/api/news` )

  if (newsResponse === null) return (
    <article className={cn( classes.quietInfo, className )}>
      Ładowanie nowinek...
    </article>
  )

  if (newsResponse.state === `error`) return (
    <article className={cn( classes.quietInfo, className )}>
      Błąd pobierania
    </article>
  )

  return (
    <article className={className}>
      {
        newsResponse.news.map( n => (
          <div key={n.title} className={classes.item}>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
          </div>
        ) )
      }
    </article>
  )
}
