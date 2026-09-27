import { useLayoutEffect, useRef } from 'react'

// Lists that print in line by line the first time they scroll into view, the way
// output lands on a console. Once per page load: coming back from a GSoC entry
// re-mounts the list, and it should already be there.
const printed = new Set()

export default function usePrintIn(key) {
    const ref = useRef(null)

    // layout effect: an already-printed list is marked before paint, so it never blinks
    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (printed.has(key) || still || !('IntersectionObserver' in window)) {
            el.dataset.printed = 'done'
            return
        }

        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            printed.add(key)
            el.dataset.printed = 'run'
            io.disconnect()
        }, { rootMargin: '0px 0px -12% 0px' })

        io.observe(el)
        return () => io.disconnect()
    }, [key])

    return ref
}
