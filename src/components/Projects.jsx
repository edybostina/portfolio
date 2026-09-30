import React from 'react'

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

export default function Projects() {
    return (
        <section id="projects" className="section">
            <h2 className="rail">projects</h2>

            <div className="section-body">
                <article className="featured">
                    <header className="project-head">
                        <h3 className="featured-title">{featured.title}</h3>
                        <Src href={featured.link} name={featured.title} />
                    </header>
                    <p className="project-note">{featured.note}</p>
                    <p className="featured-desc">{featured.desc}</p>
                    <p className="featured-detail">{featured.detail}</p>
                    <Tags tags={featured.tags} />
                </article>

                <div className="project-grid">
                    {rest.map(p => (
                        <article className="project" key={p.title}>
                            <header className="project-head">
                                <h3 className="project-title">
                                    {p.title}
                                    {p.note && <span className="project-flag">{p.note}</span>}
                                </h3>
                                <Src href={p.link} name={p.title} />
                            </header>
                            <p className="project-desc">{p.desc}</p>
                            <Tags tags={p.tags} />
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
