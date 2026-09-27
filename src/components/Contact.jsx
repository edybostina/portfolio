import React, { useState, useEffect, useRef } from 'react'
import { EMAIL, LINKS } from '../data/site'

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
    const timer = useRef(null)

    useEffect(() => () => clearTimeout(timer.current), [])

    const copyEmail = async () => {
        clearTimeout(timer.current)
        try {
            await navigator.clipboard.writeText(EMAIL)
            setState('copied')
        } catch {
            // no clipboard access (insecure context, permissions): the address
            // is still selectable text, so just say so
            setState('failed')
        }
        timer.current = setTimeout(() => setState('idle'), 2000)
    }

    return (
        <section id="contact" className="section">
            <h2 className="rail">contact</h2>

            <div className="section-body">
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

                <ul className="channels">
                    {CHANNELS.map(c => (
                        <li key={c.k}>
                            <span className="channel-k">{c.k}</span>
                            <a href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
