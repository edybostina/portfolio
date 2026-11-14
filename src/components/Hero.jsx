import React, { useEffect, useRef, useState } from 'react'
import { LINKS, PATCHES_UPSTREAM, STATS } from '../data/site'
import Region from './Region'
import { frameBits, wavePath } from '../uart'

const BOOT_IMG = `${import.meta.env.BASE_URL}perspicua-boot.jpg`
const BOOT_ALT = "perspicua's console after boot: the kernel log from driver probe to userspace, then kfetch reporting Perspicua 0.1.2 on a Raspberry Pi 4 Model B, aarch64, four Cortex-A72 cores"

// The name, as it would cross a UART: one frame per letter (see ../uart.js).
const WORDS = ['Eduard', 'Bostina']
const CELLS = 7

// What came back on the receive line: lines copied exactly from the boot
// capture (public/perspicua-boot.jpg), with the skipped stretches marked.
const RX = [
    { t: '0.024000', m: 'perspicua kernel v0.1.2-43-g26ce987-dirty (built 2026-10-13)' },
    { skip: true },
    { t: '0.113000', m: 'sched: Initialized with 4 cores' },
    { t: '0.117000', m: 'smp: Bringing up secondary cores...' },
    { t: '0.122000', m: 'smp: CPU3 online' },
    { t: '0.124000', m: 'smp: CPU2 online' },
    { t: '0.127000', m: 'smp: CPU1 online' },
    { skip: true },
    { t: '0.500000', m: "proc: loaded '/bin/init.elf' (PID 1)" },
    { m: '[ INIT ] Userspace started' },
    { m: '[ INIT ] Forking shell...' },
    { skip: true },
    { m: 'perspicua:/$ kfetch' },
    { k: 'OS', v: 'Perspicua 0.1.2 aarch64' },
    { k: 'Host', v: 'Raspberry Pi 4 Model B Rev 1.4' },
    { k: 'CPU', v: 'Cortex-A72 (4) @ 1.50 GHz' },
    { k: 'Memory', v: '6 MiB / 3939 MiB (0%)' },
    { prompt: true },
]

// The exchange plays once per page load; a hero that re-mounts later (coming
// back from a GSoC entry) is simply there.
let transmitted = false

function Wire() {
    let n = 0

    return (
        <h1 className="wire" aria-label="Eduard Bostina">
            {WORDS.map(word => (
                <span className="wire-row" aria-hidden="true" key={word}>
                    {Array.from({ length: CELLS }, (_, c) => {
                        const ch = word[c]
                        const bits = frameBits(ch)
                        const d = wavePath([ch])
                        return (
                            <span className={`wire-cell${ch ? '' : ' wire-idle'}`} style={{ '--i': n++ }} key={c}>
                                <svg viewBox="0 0 100 40" preserveAspectRatio="none" focusable="false">
                                    <path d={d} />
                                </svg>
                                <span className="wire-bits">
                                    {bits.map((b, k) => (
                                        <i key={k} className={ch && (k === 0 || k === 9) ? 'f' : undefined}>{ch ? b : ''}</i>
                                    ))}
                                </span>
                                <span className="wire-ch">{ch || '\u00a0'}</span>
                                <span className="wire-hex">{ch ? `0x${ch.charCodeAt(0).toString(16)} '${ch}'` : 'idle'}</span>
                            </span>
                        )
                    })}
                </span>
            ))}
        </h1>
    )
}

function Console() {
    return (
        <pre className="rx-log" aria-label={BOOT_ALT}>
            {RX.map((l, i) => (
                <span className="rx-line" style={{ '--j': i }} aria-hidden="true" key={i}>
                    {l.skip ? <i>[...]</i>
                        : l.prompt ? <>perspicua:/$ <span className="rx-cursor" /></>
                        : l.k ? <><b>{l.k.padEnd(9)}</b>{l.v}</>
                        : <>{l.t && <i>[{l.t.padStart(12)}] </i>}{l.m}</>}
                </span>
            ))}
        </pre>
    )
}

export default function Hero() {
    const dialog = useRef(null)
    const open = () => dialog.current?.showModal()

    const [play] = useState(() => !transmitted)
    useEffect(() => { transmitted = true }, [])

    return (
        <Region id="home" perm="rw-" tone="violet">
            <div className={play ? 'exchange exchange--play' : 'exchange'}>
                <p className="wire-meta" aria-hidden="true">
                    <span>uart0 tx</span>
                    <span>115200 8n1 · lsb first · idle high</span>
                </p>
                <Wire />

                <div className="hero-low">
                    <div>
                        <p className="hero-sub">
                            C developer, CS student at Politehnica Bucharest.{' '}
                            <a href="#projects">A kernel</a> that boots on real hardware and{' '}
                            <a href={LINKS.lore} target="_blank" rel="noopener noreferrer">
                                {PATCHES_UPSTREAM} patches accepted into Linux
                            </a>.
                        </p>
                        <p className="hero-status">open to summer 2027 internships · eu / uk</p>
                        <div className="hero-actions">
                            <a className="btn btn-primary" href={LINKS.cv} target="_blank" rel="noopener noreferrer">
                                cv.pdf
                            </a>
                            <a className="btn" href={LINKS.email}>email</a>
                        </div>
                    </div>

                    <figure className="rx">
                        <figcaption>
                            <span><span className="fig-n">uart0 rx</span> perspicua, booted on a Raspberry Pi 4</span>
                            <button type="button" className="text-btn" onClick={open}>full capture -&gt;</button>
                        </figcaption>
                        <Console />
                    </figure>
                </div>
            </div>

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

            <dialog
                ref={dialog}
                className="capture"
                aria-label="perspicua boot capture"
                onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close() }}
            >
                <div className="capture-bar">
                    <span><span className="fig-n">uart0 rx</span> perspicua, booted on a Raspberry Pi 4</span>
                    <button type="button" className="text-btn" onClick={() => dialog.current?.close()}>close</button>
                </div>
                <img src={BOOT_IMG} width="1368" height="2082" loading="lazy" alt={BOOT_ALT} />
            </dialog>
        </Region>
    )
}
