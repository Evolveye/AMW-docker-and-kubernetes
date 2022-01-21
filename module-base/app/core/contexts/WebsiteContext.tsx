import { createContext, ReactNode, useState } from "react"

export const supportedLanguages = [ `pl`, `en` ] as const
export const supportedThemeModes = [ `light`, `dark` ] as const

export const defaultLanguage = supportedLanguages[ 0 ]
export const defaultThemeMode = supportedThemeModes[ 0 ]

type SupportedLanguage = typeof supportedLanguages[number]
type SupportedThemeMode = typeof supportedThemeModes[number]

type WebsiteContextValue = {
  setThemeMode: (themeMode:SupportedThemeMode) => void
  themeMode: SupportedThemeMode
  lang: SupportedLanguage
}

type WebsiteContextProviderProps = {
  children: ReactNode
}

const WebsiteContext = createContext<WebsiteContextValue>({
  setThemeMode: () => {},
  themeMode: defaultThemeMode,
  lang: defaultLanguage,
})

export default WebsiteContext

export const WebsiteContextProvider = ({ children }:WebsiteContextProviderProps) => {
  const [ themeMode, setThemeMode ] = useState<SupportedThemeMode>( supportedThemeModes[ 0 ] )
  const [ lang, setLang ] = useState<SupportedLanguage>( supportedLanguages[ 0 ] )

  const value = {
    themeMode, setThemeMode,
    lang, setLang,
  }

  return (
    <WebsiteContext.Provider value={value}>
      {children}
    </WebsiteContext.Provider>
  )
}
