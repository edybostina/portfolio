import React from 'react'
import { NOW } from '../data/site'
import Region from './Region'
import Sched from './Sched'

const ATTRS = [
    { k: 'languages', v: ['C', 'C++', 'Assembly', 'Python', 'Shell', 'CMake'] },
    { k: 'tools', v: ['QEMU', 'GDB', 'libsodium', 'SDL2', 'SIMD/AVX2', 'git'] },
    { k: 'interests', v: ['instagram reels'] },
]

export default function About() {
    return (
        <Region id="about" perm="rw-" tone="paper">
            <h2 className="giant">about</h2>

            <div className="about">
                <div className="prose">
                    <p>
                        I mostly write C: embedded firmware, OS kernels, and low-level systems tooling.
                        I also like working with math stuff and AI/ML.
                        I've contributed to the mainline Linux kernel as a Google Summer of Code '26
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
                        <h3 className="sub-head">currently</h3>
                        <ul>
                            {NOW.map(n => <li key={n}>{n}</li>)}
                        </ul>
                    </div>

                    <table className="t kv">
                        <tbody>
                            {ATTRS.map(a => (
                                <tr key={a.k}>
                                    <th scope="row">{a.k}</th>
                                    <td>
                                        <ul className="inline">{a.v.map(v => <li key={v}>{v}</li>)}</ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Sched />
        </Region>
    )
}
