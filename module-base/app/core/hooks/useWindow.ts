import { useEffect, useState } from "react"

export default function useWindow() {
  const [ browserWindow, setBrowserWindow ] = useState<null | Window>( null )

  useEffect( () => {
    if (typeof window !== `undefined`) setBrowserWindow( window )
  }, [] )

  return browserWindow === null ? undefined : browserWindow
}
