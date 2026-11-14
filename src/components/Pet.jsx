import React, { useContext, useEffect, useRef, useState } from 'react'
import { MapContext } from '../memmap'
import { reducedMotion } from '../live'
import RockySprite, { SPRITE_GROUND } from './RockySprite'

// The pet. A small rock-shelled, five-limbed engineer, drawn as a homage to
// Rocky from Project Hail Mary, using rocky.jpeg as the visual reference.
// Reference artwork masked and posed in a 76x48 viewport.
// On this machine he is also pid 1.
//
// He lives in the unmapped space between regions and keeps himself busy: he
// walks somewhere, then codes, plays a game, naps or just stands there, then
// walks somewhere else. Click him and he says something. An easter egg:
// nothing points at him and he never gets in the way.

const GAPS_BEFORE = ['about', 'projects', 'gsoc', 'contact'] // a gap sits above each of these
const W = 76
const H = 48
const FEET = Math.round(SPRITE_GROUND) // the sprite's feet sit this far below its top
const SPEED = 34 // px per second

// what he does when he stops walking: [activity, weight, shortest ms, longest ms]
const ACTIVITIES = [
    ['code', 4, 5000, 9000],
    ['game', 3, 4500, 8000],
    ['sleep', 2, 6000, 9000],
    ['idle', 2, 1500, 3500],
    ['amaze', 1, 1400, 1800],
]
// how fast each activity flips between its two frames
const FRAME_MS = { walk: 150, code: 140, game: 120, sleep: 700, idle: 600, amaze: 130 }

const LINES = ['amaze!', 'pid 1: init', 'fist my bump', 'SIGKILL: ignored', "you can't kill init"]

function pickActivity() {
    const total = ACTIVITIES.reduce((n, a) => n + a[1], 0)
    let roll = Math.random() * total
    for (const [name, weight, min, max] of ACTIVITIES) {
        roll -= weight
        if (roll <= 0) return { name, ms: min + Math.random() * (max - min) }
    }
    return { name: 'idle', ms: 2000 }
}

export default function Pet() {
    const map = useContext(MapContext)
    const el = useRef(null)
    const [say, setSay] = useState(null)
    const clicks = useRef(0)
    const hush = useRef(0)
    const poked = useRef(false) // set by a click, read by the loop

    useEffect(() => {
        const node = el.current
        const host = node?.parentElement
        if (!node || !host) return
        const gaps = GAPS_BEFORE.map(id => map[id]?.start).filter(y => y !== undefined)
        if (!gaps.length) { node.hidden = true; return }
        node.hidden = false

        const still = reducedMotion()
        const hostTop = () => host.getBoundingClientRect().top + window.scrollY
        const maxX = () => Math.max(16, host.clientWidth - W - 16)
        const anywhere = () => 16 + Math.random() * (maxX() - 16)

        let gap = -1
        let x = anywhere()
        let target = x
        let dir = 1
        let act = 'idle'
        let until = 0
        let raf = 0
        let last = 0

        const show = frame => {
            const s = act + frame
            if (node.dataset.s !== s) node.dataset.s = s
        }
        const nearest = () => {
            const mid = window.scrollY + window.innerHeight / 2
            return gaps.reduce((best, y, i) => (Math.abs(y - mid) < Math.abs(gaps[best] - mid) ? i : best), 0)
        }
        const place = () => {
            node.style.transform = `translate(${Math.round(x)}px, ${Math.round(gaps[gap] - hostTop() - FEET)}px)`
            node.dataset.dir = dir
        }
        // if his gap has scrolled away, he turns up in the one you are looking at
        const relocate = () => {
            const y = gap < 0 ? Infinity : gaps[gap]
            const off = y < window.scrollY - 60 || y > window.scrollY + window.innerHeight + 60
            if (gap < 0 || off) {
                const g = nearest()
                if (g !== gap) { gap = g; x = anywhere(); target = x; place() }
            }
        }
        const loop = now => {
            raf = requestAnimationFrame(loop)
            const dt = Math.min(50, now - last)
            last = now

            if (poked.current) {
                poked.current = false
                act = 'amaze'
                until = now + 1600
            }

            if (act === 'walk') {
                if (Math.abs(target - x) < 1) {
                    const next = pickActivity()
                    act = next.name
                    until = now + next.ms
                } else {
                    dir = target > x ? 1 : -1
                    x += dir * SPEED * (dt / 1000)
                    place()
                }
            } else if (now >= until) {
                act = 'walk'
                target = anywhere()
            }
            show(Math.floor(now / FRAME_MS[act]) % 2)
        }

        relocate()
        place()
        show(0)
        window.addEventListener('scroll', relocate, { passive: true })
        window.addEventListener('resize', relocate)

        // only alive while actually on screen
        let io
        if (!still && 'IntersectionObserver' in window) {
            io = new IntersectionObserver(([e]) => {
                cancelAnimationFrame(raf)
                if (e.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(loop) }
            })
            io.observe(node)
        }

        return () => {
            window.removeEventListener('scroll', relocate)
            window.removeEventListener('resize', relocate)
            io?.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [map])

    const poke = () => {
        poked.current = true
        setSay(LINES[clicks.current++ % LINES.length])
        clearTimeout(hush.current)
        hush.current = setTimeout(() => setSay(null), 2200)
    }
    useEffect(() => () => clearTimeout(hush.current), [])

    return (
        <button type="button" className="pet" ref={el} onClick={poke} tabIndex={-1} aria-hidden="true" hidden>
            {say && <span className="pet-say">{say}</span>}
            <RockySprite width={W} height={H} />
        </button>
    )
}
