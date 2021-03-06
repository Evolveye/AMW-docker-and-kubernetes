import { KeyboardEvent } from "react"
import useWS from "app/core/hooks/useWS"
import { useStaeArray } from "app/core/hooks/useStateArray"
import { cn } from "app/core/functions/createClassName"
import classes from "./.module.css"
import useFetch from "app/core/hooks/useFetch"

export type ChatProps = {
  className?: string
}
export type ApiWsRes = {
  success: "success" | "error"
  wsUrl: string
}

const Message = ({ data }) => (
  <li>
    <b>{data.shape === `circle` ? `kółko` : `krzyżyk`}</b>: {data.content}
  </li>
)

export default function Chat({ className }:ChatProps) {
  const wsUrlRes = useFetch<ApiWsRes>( `GET`, `/api/ws` )
  const [ messages, messagesActions ] = useStaeArray()
  const ws = useWS( wsUrlRes?.wsUrl ?? ``, {
    message: msg => messagesActions.push( msg ),
  } )

  const onKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== `Enter`) return

    e.preventDefault()
    e.stopPropagation()

    const input = e.target as HTMLInputElement

    ws?.emit( `message`, input.value )

    input.value = ``
  }


  const disabled = ws ? ws.readyState !== ws.OPEN : true

  return (
    <article className={cn( classes.chat, className )}>
      <h3 className={classes.title}>Czat</h3>

      <ol className={classes.mesages}>
        {messages.map( (m, i) => <Message key={i} data={m} /> )}
      </ol>

      <div className={classes.inputArea}>
        <input disabled={disabled} onKeyDown={onKeyDown} />
        <small className={classes.inputHint}>
          {disabled ? `Czat nieaktywny` : `Wciśnij enter aby wysłać`}
        </small>
      </div>
    </article>
  )
}

