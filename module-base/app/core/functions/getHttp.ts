import getWindow from "./getWindow"

export type Method = "POST" | "GET" | "PUT" | "DELETE" | "OPTIONS"
export type FetchInit = {
  method: Method
  body?: string
  headers?: Record<string, string>
}

const filterObject = obj => Object.fromEntries( Object.entries( obj ).filter( ([ , v ]) => Boolean( v ) ) )
const generateQueriedUrl = (url, obj) => {
  if (!obj) return url

  const searchStr = Object.entries( filterObject( obj ) ).reduce( (str, [ k, v ]) => `${str}&${k}=${v}`, `` )

  return `${url}?${searchStr}`
}

const abstractFetch = (uri:string, init:FetchInit) => fetch( uri, init ).then( async res => {
  const contentType = res.headers.get( `content-type` )
  const resText = await res.text()

  if (contentType?.includes( `application/json` )) {
    try {
      return JSON.parse( resText )
    } catch {
      return resText
    }
  }

  return resText
} )

const post = (uri:string, data:Record<string, unknown> = {}) => abstractFetch( uri, { method:`POST`, body:JSON.stringify( filterObject( data ) ), headers:{ "content-type":`application/json` } } )
const get = (uri:string, searchObj:Record<string, string | number | null | undefined>) => abstractFetch( generateQueriedUrl( uri, searchObj ), { method:`GET` } )
const del = (uri:string, searchObj:Record<string, string | number | null | undefined>) => abstractFetch( generateQueriedUrl( uri, searchObj ), { method:`DELETE` } )

const http = { post, get, delete:del }
const window = getWindow()

if (window) (window as unknown as Window & {http: typeof http}).http = http

export default http

