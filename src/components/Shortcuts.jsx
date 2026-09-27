import React, { useState, useEffect, useRef } from 'react'

// Keyboard navigation is strictly additive: everything reachable here is also
// reachable by clicking. A site you can only drive from the keyboard is a toy.
const GO = { p: 'projects', g: 'gsoc', a: 'about', c: 'contact', h: 'home' }

const ROWS = [
    ['g h', 'home'],
    ['g p', 'projects'],
    ['g g', 'gsoc'],
    ['g a', 'about'],
    ['g c', 'contact'],
    ['?', 'this list'],
    ['esc', 'close'],
]

export default function Shortcuts() {
    const [open, setOpen] = useState(false)
    const dialog = useRef(null)

    useEffect(() => {
        let pending = null
        let clear = null

        const onKey = e => {
            if (e.metaKey || e.ctrlKey || e.altKey) return
            const tag = e.target?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return

            if (e.key === '?') { setOpen(o => !o); return }

            if (e.key === 'g' && pending !== 'g') {
                pending = 'g'
                clearTimeout(clear)
                clear = setTimeout(() => { pending = null }, 800)
                return
            }
            if (pending === 'g') {
                pending = null
                const id = GO[e.key]
                if (!id) return
                setOpen(false)
                const el = document.getElementById(id)
                // keyboard-driven, so it jumps: never make a shortcut wait on a scroll
                if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' })
                else window.location.hash = id
            }
        }

        window.addEventListener('keydown', onKey)
        return () => { window.removeEventListener('keydown', onKey); clearTimeout(clear) }
    }, [])

    // The native modal dialog owns focus: it moves focus in, keeps Tab inside,
    // closes on Esc, and hands focus back to wherever it came from.
    useEffect(() => {
        const d = dialog.current
        if (!d) return
        if (open && !d.open) d.showModal()
        else if (!open && d.open) d.close()
    }, [open])

    return (
        <dialog
            ref={dialog}
            className="help"
            aria-labelledby="help-title"
            onClose={() => setOpen(false)}
            onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
            <div className="help-box">
                <h2 id="help-title">shortcuts</h2>
                <dl>
                    {ROWS.map(([k, v]) => (
                        <div className="help-row" key={k}>
                            <dt><kbd>{k}</kbd></dt>
                            <dd>{v}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </dialog>
    )
}
