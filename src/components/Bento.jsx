import React from 'react'

const RECENT = [
    { d: '16 sep', t: 'mfd: convert TI TWL6040 to DT schema' },
    { d: '10 sep', t: 'mfd: convert TPS61050 to DT schema' },
    { d: '31 aug', t: 'input: convert TI keypad controller' },
    { d: '14 aug', t: 'pinctrl: convert TI DA850 pupd' },
]

const NOW = [
    'scheduler work in perspicua',
    'still sending patches upstream',
    'reading about lock-free queues',
]

export default function Bento() {
    return (
        <div className="bento">
            <div className="box">
                <div className="box-title">recent upstream</div>
                <ul>
                    {RECENT.map(r => (
                        <li key={r.t}><span className="lead">{r.d}</span>&nbsp; {r.t}</li>
                    ))}
                </ul>
            </div>

            <div className="box">
                <div className="box-title">currently</div>
                <ul>
                    {NOW.map(n => <li key={n}><span className="lead">&rarr;</span>&nbsp; {n}</li>)}
                </ul>
            </div>

            <div className="box">
                <div className="box-title">keyboard</div>
                <ul>
                    <li><span className="kbd">?</span> shortcuts</li>
                    <li><span className="kbd">g p</span> projects</li>
                    <li><span className="kbd">g g</span> gsoc</li>
                    <li><span className="kbd">t</span> toggle crt</li>
                </ul>
            </div>
        </div>
    )
}
