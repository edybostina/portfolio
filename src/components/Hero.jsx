import React from 'react'
import { LINKS, PATCHES_MERGED } from '../data/site'

const BOOT_IMG = `${import.meta.env.BASE_URL}perspicua-boot.jpg`

export default function Hero() {
    return (
        <section id="home" className="hero">
            <div className="hero-text">
                <div>
                    <h1 className="hero-name">Eduard Bostina</h1>
                    <p className="hero-sub">
                        C developer, CS student at Politehnica Bucharest.{' '}
                        <a href={LINKS.lore} target="_blank" rel="noopener noreferrer">
                            {PATCHES_MERGED} patches in mainline Linux
                        </a>{' '}
                        and <a href="#projects">a kernel</a> that boots on real hardware.
                    </p>
                </div>

                <div>
                    <p className="hero-status">open to summer 2027 internships · eu / uk</p>
                    <div className="hero-actions">
                        <a className="btn btn-primary" href={LINKS.cv} target="_blank" rel="noopener noreferrer">
                            cv.pdf
                        </a>
                        <a className="btn" href={LINKS.email}>email</a>
                    </div>
                </div>
            </div>

            <figure className="hero-shot">
                <img
                    src={BOOT_IMG}
                    width="760"
                    height="1025"
                    fetchPriority="high"
                    alt="perspicua's console after boot: the kernel log from driver probe to userspace, then kfetch reporting perspicua kernel v0.1 on AArch64 with four cores online"
                />
                <figcaption>perspicua, booted on a Raspberry Pi 4</figcaption>
            </figure>
        </section>
    )
}
