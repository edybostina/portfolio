import React from 'react'
import { NOW } from '../data/site'

const ATTRS = [
    { k: 'languages', v: ['C', 'C++', 'Assembly', 'Python', 'Shell', 'CMake'] },
    { k: 'tools', v: ['QEMU', 'GDB', 'libsodium', 'SDL2', 'SIMD/AVX2', 'git'] },
    { k: 'interests', v: ['instagram reels'] },
]

export default function About() {
    return (
        <section id="about" className="section">
            <h2 className="rail">about</h2>

            <div className="section-body about">
                <div className="prose">
                    <p>
                        I mostly write C: embedded firmware, OS kernels, and low-level systems tooling.
                        I also like working with math stuff and AI/ML.
                        I contribute to the mainline Linux kernel and I'm a Google Summer of Code '26
                        contributor with The Linux Foundation, working on devicetree binding conversions.
                        On the side I build perspicua, a 64-bit AArch64 kernel from scratch for the
                        Raspberry Pi 4. Currently studying CS at UPB ACS.
                    </p>
                    <p>
                        When I'm not doing this nerd stuff, I like watching and playing football, strumming
                        the guitar, and drinking beer with my closest friends.
                    </p>
                </div>

                <div className="about-side">
                    <div className="now">
                        <h3>currently</h3>
                        <ul>
                            {NOW.map(n => <li key={n}>{n}</li>)}
                        </ul>
                    </div>

                    <dl className="attrs">
                        {ATTRS.map(a => (
                            <div className="attr" key={a.k}>
                                <dt>{a.k}</dt>
                                <dd>
                                    <ul>{a.v.map(v => <li key={v}>{v}</li>)}</ul>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
