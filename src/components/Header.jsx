import React, { useState, useEffect } from 'react'

export default function Header(){
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = ['home', 'projects', 'about', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="brand">edybostina — <span className="small">portfolio</span></div>
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <a className={`navlink ${activeSection === 'home' ? 'active' : ''}`} href="#home" onClick={(e) => handleClick(e, 'home')}>Home</a>
        <a className={`navlink ${activeSection === 'projects' ? 'active' : ''}`} href="#projects" onClick={(e) => handleClick(e, 'projects')}>Projects</a>
        <a className={`navlink ${activeSection === 'about' ? 'active' : ''}`} href="#about" onClick={(e) => handleClick(e, 'about')}>About</a>
        <a className={`navlink ${activeSection === 'contact' ? 'active' : ''}`} href="#contact" onClick={(e) => handleClick(e, 'contact')}>Contact</a>
      </nav>
    </header>
  )
}