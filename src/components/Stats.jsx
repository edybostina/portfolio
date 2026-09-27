import React from 'react'
import { STATS } from '../data/site'

// One readout line, like the key/value block kfetch prints in the capture above it.
export default function Stats() {
    return (
        <ul className="readout" aria-label="In numbers">
            {STATS.map(s => (
                <li key={s.k}>
                    {s.href ? (
                        <a className="readout-n" href={s.href} target="_blank" rel="noopener noreferrer">{s.n}</a>
                    ) : (
                        <span className="readout-n">{s.n}</span>
                    )}{' '}
                    {s.k}
                </li>
            ))}
        </ul>
    )
}
