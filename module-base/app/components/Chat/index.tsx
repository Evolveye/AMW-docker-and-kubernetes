import { KeyboardEvent, useEffect, useMemo, useState } from "react"
import useWS from "app/core/hooks/useWS"
import { useStaeArray } from "app/core/hooks/useStateArray"
import getWindow from "app/core/functions/getWindow"
import { cn } from "app/core/functions/createClassName"
import classes from "./.module.css"

const WS_URL = process.env.CHAT_URL ?? ``

export type ChatProps = {
  className?: string
}

const Message = ({ data }) => (
  <li>
    {data.random}: {data.content}
  </li>
)

export default function Chat({ className }:ChatProps) {
  const [ messages, messagesActions ] = useStaeArray()
  const ws = useWS( WS_URL, {
    onMessage: msg => messagesActions.push( msg ),
  } )

  const sendMessage = data => ws?.send( JSON.stringify( data ) )
  const onKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== `Enter`) return

    e.preventDefault()
    e.stopPropagation()

    const input = e.target as HTMLInputElement

    sendMessage( input.value )

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

