import React, { useState } from 'react'

export default function Contact(){
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('egbostina@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="card" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact ✉️</h2>
      <p>If you want to reach out, contact me here</p>
      <ul className="contact-list">
        <li>
          Email: 
          <a href="mailto:egbostina@gmail.com" className="contact-link" aria-label="Send email to Eduard Bostina"><code>egbostina@gmail.com</code></a>
          <button onClick={copyEmail} className="copy-btn" aria-label="Copy email address" title="Copy email">
            {copied ? '✓' : '📋'}
          </button>
          {copied && <span className="copied-toast">Copied!</span>}
        </li>
        <li>GitHub: <a href="https://github.com/edybostina" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Visit Eduard Bostina's GitHub profile"><code>@edybostina</code></a></li>
        <li>LinkedIn: <a href="https://linkedin.com/in/edybostina" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Visit Eduard Bostina's LinkedIn profile"><code>/in/edybostina</code></a></li>
        <li>Instagram: <a href="https://instagram.com/edybostina" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Visit Eduard Bostina's Instagram profile"><code>@edybostina</code></a></li>
      </ul>
    </section>
  )
}