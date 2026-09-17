import React, { useState, useEffect } from 'react'

// Keyboard navigation is strictly additive: everything reachable here is also
// reachable by clicking. A site you can only drive from the keyboard is a toy.
const GO = { p: 'projects', g: 'gsoc', a: 'about', c: 'contact', h: 'home' }

export default function Shortcuts() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        let pending = null
        let clear = null

        const onKey = e => {
            if (e.metaKey || e.ctrlKey || e.altKey) return
            const tag = e.target?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return

            if (e.key === '?') { setOpen(o => !o); return }
            if (e.key === 'Escape') { setOpen(false); return }
            if (e.key === 't') { document.body.classList.toggle('no-crt'); return }

            if (e.key === 'g') {
                pending = 'g'
                clearTimeout(clear)
                clear = setTimeout(() => { pending = null }, 800)
                return
            }
            if (pending === 'g') {
                pending = null
                const id = GO[e.key]
                if (!id) return
                const el = document.getElementById(id)
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                else window.location.hash = id
            }
        }

        window.addEventListener('keydown', onKey)
        return () => { window.removeEventListener('keydown', onKey); clearTimeout(clear) }
    }, [])

    if (!open) return null

    return (
        <div className="help" onClick={() => setOpen(false)}>
            <div className="help-box" onClick={e => e.stopPropagation()}>
                <h4>shortcuts</h4>
                <div className="help-row"><span className="kbd">g p</span> projects</div>
                <div className="help-row"><span className="kbd">g g</span> gsoc</div>
                <div className="help-row"><span className="kbd">g a</span> about</div>
                <div className="help-row"><span className="kbd">g c</span> contact</div>
                <div className="help-row"><span className="kbd">t</span> toggle crt effect</div>
                <div className="help-row"><span className="kbd">esc</span> close</div>
            </div>
        </div>
    )
}
