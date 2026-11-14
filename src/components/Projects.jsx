import React from 'react'
import Region from './Region'
import Raster from './Raster'
import { Xor, Elim, Cpu6502, SyscallBus } from './Minis'

const featured = {
    title: 'perspicua',
    note: 'maintainer · 500+ commits',
    desc: '64-bit UNIX-like kernel for the Raspberry Pi 4, written from scratch with three friends. Boots on the real board to a userspace shell: SMP across four cores, virtual memory with copy-on-write, 47 syscalls, a VFS with FAT32 root, a page cache and its own libc.',
    detail: '22 in-kernel test suites, KASAN, lockdep and an in-kernel debugger.',
    tags: ['C', 'AArch64 asm', 'SMP', 'virtual memory', 'VFS', 'bare metal'],
    link: 'https://github.com/perspicua/perspicua',
}

const rest = [
    {
        title: 'aegis',
        Live: Xor,
        desc: 'Cross-platform CLI for authenticated file encryption. Passphrase and keyfile modes, optional compression, recursive directories. Five tagged releases with CI.',
        tags: ['C++17', 'libsodium', 'XChaCha20-Poly1305'],
        link: 'https://github.com/edybostina/aegis',
    },
    {
        title: 'rasterizer',
        Live: Raster,
        desc: 'Software 3D renderer with no GPU. Vertex transform, frustum clipping, scan-line fill, .obj loading and texture mapping. 5.9k triangles at 1920x1080 in real time; tile-based multithreading gives a 2.6x speedup.',
        tags: ['C++', 'SDL2', 'multithreading'],
        link: 'https://github.com/edybostina/rasterizer',
    },
    {
        title: 'matrix-lib',
        Live: Elim,
        desc: 'Header-only linear algebra. 50+ operations, LU/QR decomposition, eigenvalues. SIMD and automatic parallelisation give 4-8x on large matrices.',
        tags: ['C++17', 'AVX2 / NEON', 'BLAS'],
        link: 'https://github.com/edybostina/matrix-lib-cpp',
    },
    {
        title: 'mos6502',
        note: 'wip',
        Live: Cpu6502,
        desc: 'Cycle-accurate 6502 emulator, built to run original NES software.',
        tags: ['C', 'emulation'],
        link: 'https://github.com/edybostina/mos6502',
    },
]

// The block diagram restates the description above it and nothing else:
// every label is a phrase from `featured.desc` or `featured.detail`.
const KERNEL = [
    ['SMP', 'four cores'],
    ['virtual memory', 'copy-on-write'],
    ['VFS', 'FAT32 root'],
    ['page cache'],
]
const CHECKS = ['22 test suites', 'KASAN', 'lockdep', 'in-kernel debugger']

function Src({ href, name }) {
    return (
        <a className="src-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} source on GitHub`}>
            [src]
        </a>
    )
}

function Tags({ tags }) {
    return (
        <ul className="tags" aria-label="Stack">
            {tags.map(t => <li key={t}>{t}</li>)}
        </ul>
    )
}

function BlockDiagram() {
    return (
        <figure className="fig">
            <div className="bd">
                <div className="bd-layer">
                    <span className="bd-lab">userspace</span>
                    <ul className="bd-cells">
                        <li className="bd-cell">shell</li>
                        <li className="bd-cell">libc</li>
                    </ul>
                </div>
                <SyscallBus />
                <div className="bd-layer">
                    <span className="bd-lab">kernel</span>
                    <div>
                        <ul className="bd-cells">
                            {KERNEL.map(([name, sub]) => (
                                <li className="bd-cell" key={name}>
                                    {name}
                                    {sub && <small>{sub}</small>}
                                </li>
                            ))}
                        </ul>
                        <ul className="bd-cells bd-checks">
                            {CHECKS.map(c => <li className="bd-cell" key={c}>{c}</li>)}
                        </ul>
                    </div>
                </div>
                <p className="bd-hw">Raspberry Pi 4</p>
            </div>
            <figcaption>
                <span>perspicua, block diagram</span>
            </figcaption>
        </figure>
    )
}

export default function Projects() {
    return (
        <Region id="projects" perm="r-x" tone="orange">
            <h2 className="sr-only">projects</h2>

            <article className="featured">
                <div>
                    <header className="project-head">
                        <h3 className="giant">{featured.title}</h3>
                        <Src href={featured.link} name={featured.title} />
                    </header>
                    <p className="project-note">{featured.note}</p>
                    <p className="featured-desc">{featured.desc}</p>
                    <p className="featured-detail">{featured.detail}</p>
                    <Tags tags={featured.tags} />
                </div>
                <BlockDiagram />
            </article>

            <div className="project-grid">
                {rest.map(p => (
                    <article className="project" key={p.title}>
                        <header className="project-head">
                            <h3 className="sub-head">
                                {p.title}
                                {p.note && <span className="project-flag">{p.note}</span>}
                            </h3>
                            <Src href={p.link} name={p.title} />
                        </header>
                        <div className="project-live">
                            <div>
                                <p className="project-desc">{p.desc}</p>
                                <Tags tags={p.tags} />
                            </div>
                            {React.createElement(p.Live)}
                        </div>
                    </article>
                ))}
            </div>
        </Region>
    )
}
