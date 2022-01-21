import { useContext } from "react"
import { NestedObjectLeaves } from "../../types/NestedObjectKeys"
import WebsiteContext, { defaultLanguage, supportedLanguages } from "/app/core/contexts/WebsiteContext"
import translationEn from "/app/translation/en.yml"
import translationPl from "/app/translation/pl.yaml"

export type FullTranslationObj = typeof translationEn & typeof translationPl
export type SupportedLanguages = typeof supportedLanguages[number]
export type T9NProps = {
  label: NestedObjectLeaves<FullTranslationObj>
  lang?: SupportedLanguages
}

const translationObj = {
  pl: translationPl,
  en: translationEn,
}

export function getT9n( lang:SupportedLanguages ) {
  return { ...translationObj[ lang ] }
}

export default function T9n({ label, lang }:T9NProps): JSX.Element {
  const namespaces = label.split( `.` )

  const search = textLang => {
    const t9n = getT9n( textLang )
    let text = t9n

    while (namespaces.length) text = text[ namespaces.shift()! ]

    return typeof text === `string` ? text : null
  }

  const { lang:currentLang } = useContext( WebsiteContext )
  const textLang = lang ?? currentLang
  const text = search( textLang ) ?? (textLang === defaultLanguage ? label : search( defaultLanguage )) ?? label

  return <>{text}</>
}
