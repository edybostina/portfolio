import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Eduard Bostina</span>
      <span>not a web dev, bear with me</span>
      <span className="footer-keys"><kbd>?</kbd> shortcuts</span>
    </footer>
  )
}
