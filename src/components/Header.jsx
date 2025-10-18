import React from 'react'

export default function Header(){
  return (
    <header className="header">
      <div className="brand">edybostina — <span className="small">portfolio</span></div>
      <nav className="nav">
        <a className="navlink" href="#home">Home</a>
        <a className="navlink" href="#projects">Projects</a>
        <a className="navlink" href="#about">About</a>
        <a className="navlink" href="#contact">Contact</a>
      </nav>
    </header>
  )
}