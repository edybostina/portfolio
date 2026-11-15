import React, { useEffect, useRef, useState } from 'react'
import { SCENES, renderScene } from '../demos/scenes'
import { reducedMotion } from '../live'

// The hero's background: a machine waking up. It opens on one transistor,
// pulls back through the processor onto the board, brings up memory, cores
// and userspace, and ends on perspicua's shell prompt. After that the machine
// keeps quietly running. The drawing itself lives in ../demos/scenes.js.

const BOOT = SCENES.boot
// Where the machine sits in the hero: right of the text, a little smaller
// than in the study, running off the right edge.
const FRAME = { x: 0.775, y: 0.5, size: 1.08, phoneY: 0.72 }

// The boot plays once per page load. A hero that re-mounts later (coming back
// from the log) shows the machine already up.
let booted = false

export default function BootScene() {
    const canvas = useRef(null)
    const clock = useRef({ t: 0, restart: null })
    const [caption, setCaption] = useState(BOOT.chapters[0].caption)
    const [fresh] = useState(() => !booted)

    useEffect(() => {
        const el = canvas.current
        const ctx = el?.getContext('2d', { alpha: false })
        if (!ctx) return
        const still = reducedMotion()
        // already seen, or motion not wanted: start on the finished machine
        clock.current.t = !fresh || still ? BOOT.chapters.at(-1).preview : 0
        booted = true

        let width = 0, height = 0, dpr = 1, raf = 0, last = 0, chapter = -1
        let visible = true

        const draw = () => {
            if (!width || !height) return
            const t = clock.current.t
            renderScene(ctx, 'boot', t, width, height, dpr, FRAME)
            const i = BOOT.chapters.findLastIndex(c => t >= c.t)
            if (i !== chapter) { chapter = i; setCaption(BOOT.chapters[i].caption) }
        }
        const tick = now => {
            raf = 0
            if (last) clock.current.t += Math.min(0.05, (now - last) / 1000)
            last = now
            draw()
            schedule()
        }
        const schedule = () => {
            if (!still && visible && !document.hidden && !raf) raf = requestAnimationFrame(tick)
        }
        const pause = () => { cancelAnimationFrame(raf); raf = 0; last = 0 }

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = el.clientWidth
            height = el.clientHeight
            el.width = Math.round(width * dpr)
            el.height = Math.round(height * dpr)
            draw()
        }
        const ro = new ResizeObserver(resize)
        ro.observe(el)

        // only runs while the hero is on screen and the tab is in front
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting
            if (visible) schedule()
            else pause()
        })
        io.observe(el)
        const onVisibility = () => { if (document.hidden) pause(); else schedule() }
        document.addEventListener('visibilitychange', onVisibility)

        clock.current.restart = () => { clock.current.t = 0; chapter = -1; pause(); draw(); schedule() }
        // the fonts the scene letters in arrive after first paint
        document.fonts?.ready.then(draw)
        schedule()

        return () => {
            pause()
            ro.disconnect()
            io.disconnect()
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [fresh])

    return (
        <>
            <canvas className="boot-canvas" ref={canvas} aria-hidden="true" />
            <p className="boot-caption" aria-hidden="true">
                <span>{caption}</span>
                {!reducedMotion() && (
                    <button type="button" className="text-btn" onClick={() => clock.current.restart?.()}>replay</button>
                )}
            </p>
        </>
    )
}
