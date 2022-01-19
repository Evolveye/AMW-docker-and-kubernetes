export default function getWindow() {
  return typeof window === `undefined` ? null : window
}