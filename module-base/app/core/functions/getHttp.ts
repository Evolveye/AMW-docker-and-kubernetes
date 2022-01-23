export type Method = "POST" | "GET" | "PUT" | "DELETE" | "OPTIONS"
export type FetchInit = {
  method: Method
  body?: string
  headers?: Record<string, string>
}

const filterObject = obj => Object.fromEntries( Object.entries( obj ).filter( ([ , v ]) => Boolean( v ) ) )

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

  return res.text()
} )

const post = (uri:string, data:Record<string, unknown> = {}) => abstractFetch( uri, { method:`POST`, body:JSON.stringify( filterObject( data ) ), headers:{ "content-type":`application/json` } } )
const get = (uri:string, searchObj:Record<string, string | number | null | undefined>) => {
  if (!searchObj) return abstractFetch( uri, { method:`GET` } )

  const searchStr = Object.entries( filterObject( searchObj ) ).reduce( (str, [ k, v ]) => `${str}&${k}=${v}`, `` )

  return abstractFetch( `${uri}?${searchStr}`, { method:`GET` } )
}

const http = { post, get }

export default http

