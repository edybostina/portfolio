import React from 'react'

// Every number here is checkable: patches from lore, the rest from the repos.
const STATS = [
    { n: '22',  k: 'patches upstream' },
    { n: '16',  k: 'subsystems' },
    { n: '35k', k: 'loc kernel' },
    { n: '46',  k: 'syscalls' },
    { n: '9.4', k: 'gpa / 10' },
]

export default function Stats() {
    return (
        <div className="stats">
            {STATS.map(s => (
                <div className="stat" key={s.k}>
                    <div className="stat-n">{s.n}</div>
                    <div className="stat-k">{s.k}</div>
                </div>
            ))}
        </div>
    )
}
