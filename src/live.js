import { useEffect, useState } from 'react'

// Shared plumbing for the live elements: they only run while they are on
// screen, and not at all for readers who asked for reduced motion.

export const reducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useOnScreen(ref) {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el || !('IntersectionObserver' in window)) return
        const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
        io.observe(el)
        return () => io.disconnect()
    }, [ref])
    return visible
}

// Calls `fn` every `ms` while `active`. The live elements pass
// `visible && !reducedMotion()` so nothing ticks off screen.
export function useInterval(fn, ms, active) {
    useEffect(() => {
        if (!active) return
        const id = setInterval(fn, ms)
        return () => clearInterval(id)
    }, [fn, ms, active])
}
