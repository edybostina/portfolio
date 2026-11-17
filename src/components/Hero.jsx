import React, { useRef } from 'react'
import { LINKS, PATCHES_UPSTREAM, STATS } from '../data/site'
import Region from './Region'
import BootScene from './BootScene'

const BOOT_IMG = `${import.meta.env.BASE_URL}perspicua-boot.jpg`
const BOOT_ALT = "perspicua's console after boot: the kernel log from driver probe to userspace, then kfetch reporting Perspicua 0.1.2 on a Raspberry Pi 4 Model B, aarch64, four Cortex-A72 cores"

export default function Hero() {
    const dialog = useRef(null)
    const open = () => dialog.current?.showModal()

    return (
        <Region id="home" perm="rw-" tone="violet">
            <BootScene />

            <div className="hero-body">
                <p className="hero-status">open to summer 2027 internships · eu / uk</p>
                <h1 className="hero-name">Eduard<br />Bostina</h1>
                <p className="hero-sub">
                    C/C++ developer, CS student at Politehnica Bucharest.{' '}
                    <a href="#projects">A kernel</a> that boots on real hardware and{' '}
                    <a href={LINKS.lore} target="_blank" rel="noopener noreferrer">
                        {PATCHES_UPSTREAM} patches accepted into Linux
                    </a>.
                </p>
                <div className="hero-actions">
                    <a className="btn btn-primary" href={LINKS.cv} target="_blank" rel="noopener noreferrer">
                        cv.pdf
                    </a>
                    <a className="btn" href={LINKS.email}>email</a>
                    <button type="button" className="text-btn" onClick={open}>boot capture -&gt;</button>
                </div>
            </div>

            <dl className="readout" aria-label="In numbers">
                {STATS.map(g => (
                    <div className="readout-group" key={g.label}>
                        <dt>
                            {g.href ? (
                                <a href={g.href} target="_blank" rel="noopener noreferrer">{g.label}</a>
                            ) : g.label}
                        </dt>
                        {g.items.map(s => (
                            <dd key={s.k}><span className="readout-n">{s.n}</span> {s.k}</dd>
                        ))}
                    </div>
                ))}
            </dl>

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
