import { Router } from "blitz"

export default function redirect( to:string ) {
  Router.push( to )
}
