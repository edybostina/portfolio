import React from 'react'

const BOOT_IMG = `${import.meta.env.BASE_URL}perspicua-boot.jpg`

const projects = [
    {
        title: 'perspicua',
        note: 'maintainer · 463 commits',
        desc: '64-bit UNIX-like kernel for the Raspberry Pi 4, written from scratch with three friends. Boots on the real board to a userspace shell: SMP across four cores, virtual memory with copy-on-write, 46 syscalls, a VFS with FAT32 root, a page cache and its own libc. 21 in-kernel test suites, KASAN, lockdep and an in-kernel debugger.',
        tags: ['C', 'AArch64 asm', 'SMP', 'virtual memory', 'VFS', 'bare metal'],
        link: 'https://github.com/perspicua/perspicua',
        wide: true,
        shot: BOOT_IMG,
        shotAlt: 'perspicua booting on a Raspberry Pi 4, kernel log on an attached display',
        shotCap: 'booting on real hardware',
    },
    {
        title: 'aegis',
        desc: 'Cross-platform CLI for authenticated file encryption. Passphrase and keyfile modes, optional compression, recursive directories. Five tagged releases with CI.',
        tags: ['C++17', 'libsodium', 'XChaCha20-Poly1305'],
        link: 'https://github.com/edybostina/aegis',
    },
    {
        title: 'rasterizer',
        desc: 'Software 3D renderer with no GPU. Vertex transform, frustum clipping, scan-line fill, .obj loading and texture mapping. 5.9k triangles at 1920x1080 in real time; tile-based multithreading gives a 2.6x speedup.',
        tags: ['C++', 'SDL2', 'multithreading'],
        link: 'https://github.com/edybostina/rasterizer',
    },
    {
        title: 'matrix-lib',
        desc: 'Header-only linear algebra. 50+ operations, LU/QR decomposition, eigenvalues. SIMD and automatic parallelisation give 4-8x on large matrices.',
        tags: ['C++17', 'AVX2 / NEON', 'BLAS'],
        link: 'https://github.com/edybostina/matrix-lib-cpp',
    },
    {
        title: 'mos6502',
        note: 'wip',
        desc: 'Cycle-accurate 6502 emulator, built to run original NES software.',
        tags: ['C', 'emulation'],
        link: 'https://github.com/edybostina/mos6502-emulator',
    },
]

function Card({ p }) {
    const body = (
        <>
            <a className="card-src" href={p.link} target="_blank" rel="noopener noreferrer">
                [src]
            </a>
            <div className="card-title">
                {p.title}
                {p.note && <span className="card-note">{p.note}</span>}
            </div>
            <p className="card-desc">{p.desc}</p>
            <div className="tags">
                {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
            </div>
        </>
    )

    if (!p.wide) return <div className="card">{body}</div>

    return (
        <div className="card wide">
            <div>{body}</div>
            <div>
                <img className="shot" src={p.shot} alt={p.shotAlt} loading="lazy" />
                <div className="shot-cap">{p.shotCap}</div>
            </div>
        </div>
    )
}

export default function Projects() {
    return (
        <section id="projects">
            <div className="section-heading">Projects</div>
            <div className="project-grid">
                {projects.map(p => <Card p={p} key={p.title} />)}
            </div>
        </section>
    )
}
