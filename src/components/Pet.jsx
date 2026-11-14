import React, { useContext, useEffect, useRef, useState } from 'react'
import { MapContext } from '../memmap'
import { reducedMotion } from '../live'

// The pet. A small rock-shelled, five-limbed engineer, drawn as a homage to
// Rocky from Project Hail Mary (not a copy of anyone's artwork: a 38x24 pixel
// sprite made for this page). On this machine he is also pid 1.
//
// He lives in the unmapped space between regions and keeps himself busy: he
// walks somewhere, then codes, plays a game, naps or just stands there, then
// walks somewhere else. Click him and he says something. An easter egg:
// nothing points at him and he never gets in the way.

const GAPS_BEFORE = ['projects', 'gsoc', 'about', 'contact'] // a gap sits above each of these
const SCALE = 2
const W = 38 * SCALE
const H = 24 * SCALE
const FEET = 22 * SCALE // the sprite's feet sit this far below its top
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

// ── the sprite ──────────────────────────────────────────────────────────
// A 38x24 grid. Each part is a list of [x, y, w, h, ink]. Inks: s stone,
// d stone in shade, l stone lit, k ink, g moss, v violet, y yellow. A part
// shows in the states listed for it (activity + frame, e.g. "walk0").
//
// The body: a cracked five-sided shell, wider than tall, with moss on one
// shoulder. Three thick legs carry it; two arms end in three-fingered hands.

const px = (rects, key) => rects.map(([x, y, w, h, c], i) => (
    <rect key={`${key}${i}`} x={x} y={y} width={w} height={h} className={`px-${c}`} />
))

const SHELL = [
    [13, 5, 6, 1, 's'], [11, 6, 10, 1, 's'], [10, 7, 12, 1, 's'], [9, 8, 14, 4, 's'], [10, 12, 12, 1, 's'],
    // underside and the side away from the light
    [12, 13, 8, 1, 'd'], [21, 8, 2, 4, 'd'], [19, 12, 3, 1, 'd'], [20, 7, 2, 1, 'd'],
    // the lit edge
    [13, 5, 3, 1, 'l'], [11, 6, 4, 1, 'l'], [10, 7, 3, 1, 'l'], [9, 8, 2, 1, 'l'], [9, 9, 1, 1, 'l'],
    // cracks
    [15, 7, 1, 3, 'k'], [14, 10, 1, 1, 'k'], [13, 11, 1, 1, 'k'], [16, 9, 2, 1, 'k'], [18, 10, 1, 1, 'k'], [11, 10, 1, 1, 'k'],
    // moss
    [18, 6, 2, 1, 'g'], [19, 7, 1, 1, 'g'],
]

const ARM_L = [[7, 8, 2, 3, 's'], [4, 9, 3, 3, 'd'], [2, 9, 2, 1, 's'], [2, 11, 2, 1, 's'], [3, 10, 1, 1, 's']]
const ARM_R = [[23, 8, 2, 3, 's'], [25, 9, 3, 3, 'd'], [28, 9, 2, 1, 's'], [28, 11, 2, 1, 's'], [28, 10, 1, 1, 's']]

// arms hang off the shell, so they sit and stand with it
const ARMS = [
    ['walk0 walk1 idle0 idle1 code0 code1 game0 game1 sleep0 sleep1', ARM_L],
    ['walk0 walk1 idle0 idle1 sleep0 sleep1', ARM_R],
    // both arms up, hands open
    ['amaze0', [
        [7, 7, 2, 3, 's'], [5, 3, 3, 5, 'd'], [5, 2, 3, 1, 's'], [4, 0, 1, 3, 's'], [6, 0, 1, 2, 's'], [8, 0, 1, 3, 's'],
        [23, 7, 2, 3, 's'], [24, 3, 3, 5, 'd'], [24, 2, 3, 1, 's'], [23, 0, 1, 3, 's'], [25, 0, 1, 2, 's'], [27, 0, 1, 3, 's'],
    ]],
    // and a little wider
    ['amaze1', [
        [7, 7, 2, 3, 's'], [6, 7, 1, 2, 's'], [3, 3, 3, 5, 'd'], [3, 2, 3, 1, 's'], [2, 0, 1, 3, 's'], [4, 0, 1, 2, 's'], [6, 0, 1, 3, 's'],
        [23, 7, 2, 3, 's'], [25, 7, 1, 2, 's'], [26, 3, 3, 5, 'd'], [26, 2, 3, 1, 's'], [25, 0, 1, 3, 's'], [27, 0, 1, 2, 's'], [29, 0, 1, 3, 's'],
    ]],
    // typing: the hand comes down on the keys, then lifts
    ['code0', [[23, 8, 2, 3, 's'], [25, 9, 4, 3, 'd'], [29, 10, 3, 5, 'd'], [29, 15, 1, 2, 's'], [31, 15, 1, 2, 's']]],
    ['code1', [[23, 8, 2, 3, 's'], [25, 9, 4, 3, 'd'], [29, 10, 3, 4, 'd'], [29, 14, 1, 2, 's'], [31, 14, 1, 2, 's']]],
    // holding the pad
    ['game0 game1', [[23, 8, 2, 3, 's'], [25, 8, 3, 3, 'd']]],
]

const THIGHS = [[6, 12, 4, 3, 's'], [22, 12, 4, 3, 's'], [14, 14, 4, 3, 's']]

const LEGS = [
    ['idle0 idle1 amaze0 amaze1', [
        ...THIGHS,
        [4, 15, 3, 6, 'd'], [25, 15, 3, 6, 'd'], [14, 17, 4, 4, 'd'],
        [2, 21, 6, 1, 'd'], [24, 21, 6, 1, 'd'], [13, 21, 6, 1, 'd'],
        [4, 17, 3, 1, 'k'], [26, 16, 1, 1, 'g'],
    ]],
    // outer legs up
    ['walk0', [
        ...THIGHS,
        [4, 15, 3, 5, 'd'], [25, 15, 3, 5, 'd'], [14, 17, 4, 4, 'd'],
        [2, 20, 6, 1, 'd'], [24, 20, 6, 1, 'd'], [13, 21, 6, 1, 'd'],
        [4, 17, 3, 1, 'k'], [26, 16, 1, 1, 'g'],
    ]],
    // middle leg up
    ['walk1', [
        ...THIGHS,
        [4, 15, 3, 6, 'd'], [25, 15, 3, 6, 'd'], [14, 17, 4, 3, 'd'],
        [2, 21, 6, 1, 'd'], [24, 21, 6, 1, 'd'], [13, 20, 6, 1, 'd'],
        [4, 17, 3, 1, 'k'], [26, 16, 1, 1, 'g'],
    ]],
    // sitting: legs folded under and out to the sides
    ['code0 code1 game0 game1 sleep0 sleep1', [
        [5, 16, 5, 3, 's'], [22, 16, 5, 3, 's'],
        [2, 19, 6, 3, 'd'], [23, 19, 6, 3, 'd'], [13, 19, 6, 3, 'd'],
        [3, 19, 3, 1, 'k'],
    ]],
]

const PROPS = [
    // a laptop, side on; the screen flickers as he types
    ['code0 code1', [[29, 20, 9, 2, 'k'], [36, 11, 2, 9, 'k']]],
    ['code0', [[35, 12, 1, 1, 'y'], [35, 14, 1, 1, 'y'], [35, 16, 1, 1, 'y']]],
    ['code1', [[35, 13, 1, 1, 'y'], [35, 15, 1, 1, 'y'], [35, 17, 1, 1, 'y']]],
    // a gamepad, mashed
    ['game0', [[28, 11, 9, 4, 'v'], [35, 12, 1, 1, 'y'], [34, 13, 1, 1, 'y'], [29, 12, 3, 1, 'k'], [30, 11, 1, 3, 'k']]],
    ['game1', [[28, 10, 9, 4, 'v'], [35, 11, 1, 1, 'y'], [34, 12, 1, 1, 'y'], [29, 11, 3, 1, 'k'], [30, 10, 1, 3, 'k']]],
    // asleep
    ['sleep0', [[26, 2, 4, 1, 'v'], [28, 3, 1, 1, 'v'], [27, 4, 1, 1, 'v'], [26, 5, 4, 1, 'v']]],
    ['sleep1', [[26, 2, 4, 1, 'v'], [28, 3, 1, 1, 'v'], [27, 4, 1, 1, 'v'], [26, 5, 4, 1, 'v'], [31, 0, 3, 1, 'v'], [32, 1, 1, 1, 'v'], [31, 2, 3, 1, 'v']]],
]

const parts = (list, key) => list.map(([states, rects], i) => (
    <g data-p={states} key={`${key}${i}`}>{px(rects, key)}</g>
))

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
            <svg viewBox="0 0 38 24" width={W} height={H} shapeRendering="crispEdges" focusable="false">
                {parts(LEGS, 'l')}
                <g className="pet-top">
                    {px(SHELL, 's')}
                    {parts(ARMS, 'a')}
                </g>
                {parts(PROPS, 'p')}
            </svg>
        </button>
    )
}
