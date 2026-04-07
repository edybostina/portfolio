import React, { useState } from 'react'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('egbostina@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact">
      <div className="section-heading">Contact</div>
      <ul className="contact-list">
        <li>
          <span className="contact-label">email</span>
          <a href="mailto:egbostina@gmail.com" className="contact-link">egbostina@gmail.com</a>
          <button className={`copy-btn${copied ? ' did-copy' : ''}`} onClick={copyEmail}>
            {copied ? 'copied' : 'copy'}
          </button>
        </li>
        <li>
          <span className="contact-label">github</span>
          <a href="https://github.com/edybostina" target="_blank" rel="noopener noreferrer" className="contact-link">
            github.com/edybostina
          </a>
        </li>
        <li>
          <span className="contact-label">linkedin</span>
          <a href="https://linkedin.com/in/edybostina" target="_blank" rel="noopener noreferrer" className="contact-link">
            linkedin.com/in/edybostina
          </a>
        </li>
        <li>
          <span className="contact-label">instagram</span>
          <a href="https://instagram.com/edybostina" target="_blank" rel="noopener noreferrer" className="contact-link">
            @edybostina
          </a>
        </li>
      </ul>
    </section>
  )
}
