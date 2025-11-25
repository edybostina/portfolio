import React from 'react'

export default function Footer(){
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Eduard Bostina</div>
      <div className="small">I am not a web dev, so please bear with me.</div>
    </footer>
  )
}