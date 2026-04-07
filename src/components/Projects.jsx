import React from 'react'

const projects = [
  {
    title: 'perspicua',
    desc: '64-bit UNIX-like kernel for Raspberry Pi 4 (AArch64/Cortex-A72). SMP, virtual memory (39-bit, 4KB pages), framebuffer console. C, Assembly.',
    link: 'https://github.com/perspicua/perspicua',
  },
  {
    title: 'aegis',
    desc: 'Cross-platform CLI for secure file encryption. C++17, libsodium (XChaCha20-Poly1305), zlib. Passphrases, keyfiles, recursive directory encryption.',
    link: 'https://github.com/edybostina/aegis',
  },
  {
    title: 'rasterizer',
    desc: 'Real-time 3D software rasterizer. C++17, SDL2. Multithreaded. Texture mapping, .obj loading, custom math library.',
    link: 'https://github.com/edybostina/rasterizer',
  },
  {
    title: 'matrix-lib',
    desc: 'Header-only C++17 matrix library. SIMD acceleration (AVX2/NEON), LU/QR decomposition, auto-parallelisation for large matrices.',
    link: 'https://github.com/edybostina/matrix-lib-cpp',
  },
  {
    title: 'mini-gpt',
    desc: 'GPT-2 style language model training framework. Python, PyTorch. WIP.',
    link: 'https://github.com/edybostina/mini-gpt',
  },
]

export default function Projects() {
  return (
    <section id="projects">
      <div className="section-heading">Projects</div>
      <div className="projects-list">
        {projects.map(p => (
          <div className="project" key={p.title}>
            <span className="project-title">{p.title}</span>
            <span className="project-desc">{p.desc}</span>
            <a
              className="project-link"
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              [src]
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
