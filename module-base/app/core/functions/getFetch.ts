export type Method = "POST" | "GET" | "PUT" | "DELETE" | "OPTIONS"
export type FetchPrimitives = string | number
export type FetchComplexTypes = { [key:string]: FetchComplexTypes } | { [key:string]: FetchComplexTypes }[]
export type FetchInit = {
  method: Method
  body?: string
  headers?: Record<string, string>
}

const abstractFetch = (uri:string, init:FetchInit) => fetch( uri, init )
const post = (uri:string, data:FetchComplexTypes = {}) => abstractFetch( uri, { method:`POST`, body:JSON.stringify( data ) } )
const get = (uri:string, searchObj:Record<string, FetchPrimitives>) => {
  if (!searchObj) return abstractFetch( uri, { method:`GET` } )

  const searchStr = Object.entries( searchObj ).reduce( (str, [ k, v ]) => `${str}&${k}=${v}`, `` )

  return abstractFetch( `${uri}?${searchStr}`, { method:`GET` } )
}

const http = { post, get }

export default http
