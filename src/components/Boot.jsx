import React, { useState, useEffect } from 'react'

// Real boot output from perspicua, trimmed. Plays once per browser session:
// a returning visitor should never have to sit through it twice.
const LINES = [
    'Perspicua 0.9.0 (aarch64) booting on Raspberry Pi 4 Model B',
    '[    0.000000] CPU0: Cortex-A72 r0p3, EL1',
    '[    0.004112] mm: buddy allocator online',
    '[    0.011907] mmu: 4-level page tables, 39-bit VA, 4 KiB pages',
    '[    0.019448] smp: bringing up secondary cores ......... 4/4 online',
    '[    0.028771] vfs: mounted fat32 on /',
    '[    0.033190] sched: per-core runqueues, work stealing',
    '[    0.041002] uart: pl011 @ 0x3f201000',
    '[    0.049318] init: starting /bin/sh',
    '',
    'eduard@mainline:~$ whoami',
    'c developer, linux kernel contributor',
]

const SEEN_KEY = 'perspicua-booted'

function alreadySeen() {
    try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}

export default function Boot() {
    const [hidden, setHidden] = useState(alreadySeen)
    const [leaving, setLeaving] = useState(false)
    const [shown, setShown] = useState(0)

    useEffect(() => {
        if (hidden) return

        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        const timers = []

        const dismiss = () => {
            try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
            setLeaving(true)
            timers.push(setTimeout(() => setHidden(true), 360))
        }

        if (reduced) { dismiss(); return }

        let t = 0
        LINES.forEach((line, i) => {
            t += line === '' ? 60 : (i < 9 ? 85 : 150)
            timers.push(setTimeout(() => setShown(n => Math.max(n, i + 1)), t))
        })
        timers.push(setTimeout(dismiss, t + 520))

        window.addEventListener('keydown', dismiss, { once: true })
        window.addEventListener('click', dismiss, { once: true })

        return () => {
            timers.forEach(clearTimeout)
            window.removeEventListener('keydown', dismiss)
            window.removeEventListener('click', dismiss)
        }
    }, [hidden])

    if (hidden) return null

    return (
        <div className={`boot${leaving ? ' leaving' : ''}`} aria-hidden="true">
            {LINES.slice(0, shown).map((line, i) => (
                <div className="boot-line" key={i}>{line || ' '}</div>
            ))}
            {shown >= LINES.length && (
                <div className="boot-line">eduard@mainline:~$ <span className="cursor" /></div>
            )}
            <span className="boot-skip">press any key to skip</span>
        </div>
    )
}
