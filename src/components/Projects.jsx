import React from 'react'

const projects = [
  { title: 'Aegis', desc: 'Modern, cross-platform CLI for secure file encryption — built in C++17 with libsodium and zlib', emoji: '🔒', link: 'https://github.com/edybostina/aegis' },
  { title: 'Matrix Library', desc: 'A simple and efficient header-only C++ template matrix class for educational and prototyping use.', emoji: '📊', link: 'https://github.com/edybostina/matrix-lib-cpp' },
  { title: 'Rasterizer', desc: 'A software rasterizer written in modern C++ that transforms, clips, and rasterizes 3D models to a pixel buffer.', emoji: '🖼️', link: 'https://github.com/edybostina/rasterizer' },
  { title: 'Mini GPT', desc: 'A scalable GPT-2 style language model training framework in Python with PyTorch.', emoji: '🤖', link: 'https://github.com/edybostina/mini-gpt' },
  { title: 'Retro Portfolio', desc: 'A minimalist, retro-styled portfolio website built with React and Vite.', emoji: '🌐', link: '#' }
]

export default function Projects(){
  return (
    <section id="projects" className="card" aria-labelledby="projects-heading">
      <h2 id="projects-heading">Projects 🗂️</h2>
      <div className="projects-list" role="list">
        {projects.map(p => (
          <article className="project" key={p.title} role="listitem">
            <div className="project-info">
              <div className="project-title">{p.emoji} {p.title}</div>
              <div className="small">{p.desc}</div>
            </div>
            <a href={p.link} className="navlink" target={p.link.startsWith('http') ? '_blank' : '_self'} rel={p.link.startsWith('http') ? 'noopener noreferrer' : ''} aria-label={`View ${p.title} project`}>view ↗</a>
          </article>
        ))}
      </div>
    </section>
  )
}