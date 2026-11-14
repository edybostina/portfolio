import { createContext, useLayoutEffect, useState } from 'react'

// The page as an address space. Every region's address is real: its offset
// from the top of the document, in pixels, printed in hex. Nothing is made up,
// so the numbers change when the layout does.

export const MapContext = createContext({})

export const hex = n => '0x' + Math.max(0, Math.round(n)).toString(16).padStart(4, '0')

// Measures every [data-region] on the page and keeps the map current as the
// layout changes (fonts landing, a resize, a route change).
export function useMemoryMap(routeKey) {
    const [map, setMap] = useState({})

    useLayoutEffect(() => {
        const measure = () => {
            const next = {}
            document.querySelectorAll('[data-region]').forEach(el => {
                const start = el.getBoundingClientRect().top + window.scrollY
                next[el.dataset.region] = { start, end: start + el.offsetHeight }
            })
            setMap(prev => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(document.body)
        return () => ro.disconnect()
    }, [routeKey])

    return map
}
