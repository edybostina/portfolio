import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'

const SECTIONS = ['home', 'projects', 'gsoc', 'about', 'contact']

export default function Header({ onPost }) {
  const [active, setActive] = useState('home')
  const navRef = useRef(null)
  const barRef = useRef(null)

  // Track which section sits under the header without a scroll listener:
  // a thin band near the top of the viewport, and whichever section crosses it wins.
  useEffect(() => {
    if (onPost) return
    const els = SECTIONS.map(id => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-72px 0px -70% 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [onPost])

  // One underline that travels to the active link, so moving between sections
  // reads as moving along the same page. Written straight to the element's
  // transform: no re-render per move.
  useLayoutEffect(() => {
    const nav = navRef.current
    const bar = barRef.current
    if (!nav || !bar) return

    const place = () => {
      const link = !onPost && nav.querySelector(`[data-section="${active}"]`)
      if (!link) { delete bar.dataset.on; return }
      // rects, not offsetLeft/offsetWidth: those round, and the bar would sit a pixel off
      const l = link.getBoundingClientRect()
      const n = nav.getBoundingClientRect()
      bar.style.transform = `translateX(${l.left - n.left}px) scaleX(${l.width})`
      bar.dataset.on = ''
    }

    place()
    // the first placement lands without travelling; later moves animate
    const raf = requestAnimationFrame(() => { bar.dataset.ready = '' })
    // widths change when the web font arrives and when the layout wraps
    const ro = new ResizeObserver(place)
    ro.observe(nav)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [active, onPost])

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
    <header className="header">
      <a className="brand" href="#home" onClick={e => handleClick(e, 'home')}>
        edybostina
      </a>
      <nav className="nav" aria-label="Sections" ref={navRef}>
        {SECTIONS.map(id => (
          <a
            key={id}
            className="navlink"
            href={`#${id}`}
            data-section={id}
            aria-current={!onPost && active === id ? 'true' : undefined}
            onClick={e => handleClick(e, id)}
          >
            {id}
          </a>
        ))}
        <span className="nav-bar" ref={barRef} aria-hidden="true" />
      </nav>
    </header>
  )
}
