import React, { useState, useEffect, useRef } from 'react'
import { EMAIL, LINKS } from '../data/site'
import Region from './Region'
import { wavePath } from '../uart'

// The address as it would cross the line, one frame per character.
const BYTES = [...EMAIL]
const WAVE = wavePath(BYTES)
const IDLE = wavePath(BYTES.map(() => null))

const CHANNELS = [
    { k: 'cv.pdf', href: LINKS.cv, label: 'Eduard_Bostina_CV.pdf' },
    { k: 'github', href: LINKS.github, label: 'github.com/edybostina' },
    { k: 'lore', href: LINKS.lore, label: 'lore.kernel.org' },
    { k: 'linkedin', href: LINKS.linkedin, label: 'linkedin.com/in/edybostina' },
    { k: 'instagram', href: LINKS.instagram, label: '@edybostina' },
]

export default function Contact() {
    // idle | copied | failed
    const [state, setState] = useState('idle')
    // how many times the address has been sent; 0 means the line has stayed idle
    const [sent, setSent] = useState(0)
    const timer = useRef(null)

    useEffect(() => () => clearTimeout(timer.current), [])

    const copyEmail = async () => {
        clearTimeout(timer.current)
        try {
            await navigator.clipboard.writeText(EMAIL)
            setState('copied')
            setSent(n => n + 1) // only a copy that worked goes down the wire
        } catch {
            // no clipboard access (insecure context, permissions): the address
            // is still selectable text, so just say so
            setState('failed')
        }
        timer.current = setTimeout(() => setState('idle'), 2000)
    }

    return (
        <Region id="contact" perm="-w-" tone="ink">
            <h2 className="sr-only">contact</h2>

            <div>
                <div className="mail">
                    <a className="mail-addr" href={LINKS.email}>{EMAIL}</a>
                    <button type="button" className={`copy-btn is-${state}`} onClick={copyEmail}>
                        {state === 'copied' ? 'copied' : state === 'failed' ? 'copy failed' : 'copy'}
                    </button>
                    <span className="sr-only" aria-live="polite">
                        {state === 'copied' ? 'Email address copied'
                            : state === 'failed' ? 'Could not copy. Select the address instead.' : ''}
                    </span>
                </div>

                <div className={`tx${sent ? ' tx--sent' : ''}`} key={sent} aria-hidden="true">
                    <p className="tx-meta">
                        <span>uart0 tx</span>
                        <span>{sent ? `${BYTES.length} bytes · 8n1` : 'idle'}</span>
                    </p>
                    <svg viewBox={`0 0 ${BYTES.length * 100} 40`} preserveAspectRatio="none" focusable="false">
                        <path d={sent ? WAVE : IDLE} />
                    </svg>
                    <p className="tx-chars" style={{ gridTemplateColumns: `repeat(${BYTES.length}, 1fr)` }}>
                        {BYTES.map((ch, i) => <span key={i} style={{ '--i': i }}>{sent ? ch : ''}</span>)}
                    </p>
                </div>

                <table className="t kv channels">
                    <tbody>
                        {CHANNELS.map(c => (
                            <tr key={c.k}>
                                <th scope="row">{c.k}</th>
                                <td><a href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Region>
    )
}
