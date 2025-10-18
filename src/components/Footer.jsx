import React from 'react'

export default function Footer(){
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Eduard Bostina</div>
      <div className="small">Made with text, emojis, and a sprinkle of 2000s ✨</div>
    </footer>
  )
}