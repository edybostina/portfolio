import React, { useContext, useEffect, useRef, useState } from 'react'
import { MapContext, hex } from '../memmap'

// The navigation is the map listing, the way /proc/self/maps prints one.
// Permissions are the joke: code is r-x, the log is read-only, contact is write-only.
const SECTIONS = [
  { id: 'home', perm: 'rw-' },
  { id: 'projects', perm: 'r-x' },
  { id: 'gsoc', perm: 'r--' },
  { id: 'about', perm: 'rw-' },
  { id: 'contact', perm: '-w-' },
]

export default function Rail({ onPost }) {
  const map = useContext(MapContext)
  const [active, setActive] = useState('home')
  const pc = useRef(null)

  // One scroll handler. It moves the program counter (the top of the viewport,
  // written straight to the node) and works out which region is being read:
  // the one a third of the way down the screen, or the last one once the page
  // has run out. Scroll events already arrive at most once per frame, and the
  // work is five comparisons, so there is nothing to throttle.
  const mapRef = useRef(map)
  useEffect(() => { mapRef.current = map }, [map])

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      if (pc.current) pc.current.textContent = hex(y)
      if (onPost) return
      const atEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 2
      const probe = y + window.innerHeight / 3
      let current = SECTIONS[0].id
      for (const { id } of SECTIONS) {
        const r = mapRef.current[id]
        if (r && (atEnd || probe >= r.start)) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [onPost, map])

  const handleClick = (e, id) => {
    const el = document.getElementById(id)
    if (!el) return // on a post page: let the hash change render the main page
    e.preventDefault()
    // pointer clicks scroll (via the CSS, so reduced motion still applies);
    // keyboard activation (detail 0) jumps
    el.scrollIntoView({ block: 'start', behavior: e.detail === 0 ? 'instant' : 'auto' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className="rail">
      <a className="brand" href="#home" onClick={e => handleClick(e, 'home')}>
        edybostina
      </a>
      <nav aria-label="Sections">
        <p className="maps-head" aria-hidden="true">
          <span>addr</span><span>perm</span><span>region</span>
        </p>
        <ul className="maps">
          {SECTIONS.map(({ id, perm }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={!onPost && active === id ? 'true' : undefined}
                onClick={e => handleClick(e, id)}
              >
                <span className="maps-addr" aria-hidden="true">{map[id] ? hex(map[id].start) : '------'}</span>
                <span className="maps-perm" aria-hidden="true">{perm}</span>
                <span>{id}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="pc" aria-hidden="true">
        <span>pc</span>
        <strong ref={pc}>0x0000</strong>
      </p>
    </header>
  )
}
