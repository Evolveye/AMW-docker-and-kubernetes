import { ReactNode } from "react"
import { Link as BlitzLink } from "blitz"

export type LinkAttributes = {
  children: ReactNode
  to: string
}

export default function Link({ children, to }:LinkAttributes) {
  if (to.startsWith( `https?://` )) {
    return <a href={to}>{children}</a>
  }

  return <BlitzLink href={to}><a>{children}</a></BlitzLink>
}
