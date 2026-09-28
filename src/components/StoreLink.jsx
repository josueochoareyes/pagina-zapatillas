/** Keep real URLs, browser history and modified-click navigation intact. */
export default function StoreLink({ href, destination, onNavigate, children, ...props }) {
  return <a {...props} href={href} onClick={event => {
    if (!onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(destination)
  }}>{children}</a>
}
