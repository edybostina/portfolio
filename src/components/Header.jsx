import React, { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'about', 'contact']
      const current = sections.find(id => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="header">
      <div className="brand">edybostina</div>
      <nav className="nav">
        {['home', 'projects', 'about', 'contact'].map(section => (
          <a
            key={section}
            className={`navlink${activeSection === section ? ' active' : ''}`}
            href={`#${section}`}
            onClick={e => handleClick(e, section)}
          >
            {section}
          </a>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
