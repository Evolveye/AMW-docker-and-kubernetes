export type DateLike = Date | string | number


export function getDateParts( dateLike:DateLike = Date.now() ) {
  const padPart = (part, length = 2, char = 0) => `${part}`.padStart( length, `${char}` )
  const date = dateLike instanceof Date ? dateLike : new Date( dateLike )

  const parts = {
    YYYY: padPart( date.getFullYear() ),
    MM: padPart( date.getMonth() + 1 ),
    DD: padPart( date.getDate() ),
    hh: padPart( date.getHours() ),
    mm: padPart( date.getMinutes() ),
    ss: padPart( date.getSeconds() ),
    ms: `${date.getMilliseconds()}`,
  }

  return parts
}


export default function getDate( dateLike:DateLike = Date.now(), format = `YYYY.MM.DD hh:mm` ) {
  const parts = getDateParts( dateLike )

  return `${format}`
    .replace( /YYYY/g, parts.YYYY )
    .replace( /YY/g, parts.YYYY.slice( -2 ) )
    .replace( /MM/g, parts.MM )
    .replace( /DD/g, parts.DD )
    .replace( /hh/g, parts.hh )
    .replace( /mm/g, parts.mm )
    .replace( /ms/g, parts.ms )
}
