export default function createClassName( ...classes ) {
  return classes.reduce( (str, name) => name && typeof name === `string` ? `${str} ${name}` : str, `` )
}

export function cn( ...classes ) {
  return createClassName( ...classes )
}
