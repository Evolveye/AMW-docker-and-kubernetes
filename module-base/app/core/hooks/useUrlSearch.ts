import useWindow from "./useWindow"

export default function useUrlSearch() {
  const window = useWindow()
  const searchStr = window?.location.search

  if (!searchStr) return {}

  const searchEntries = searchStr.slice( 1 )
    .split( `&` )
    .map( keyValPair => keyValPair.split( `=` ) )

  return Object.fromEntries( searchEntries )
}
