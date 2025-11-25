import React from 'react'
import Header from './components/Header'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <div className="page">
      <ThemeToggle />
      <Header />
      <main className="content" role="main">
        <section id="home" className="card" aria-labelledby="home-heading">
          <h2 id="home-heading">Hey there! 👋</h2>
          <p>Hi, I'm <strong>Eduard Bostina</strong>, a computer science student at the <strong>Polytechnic University of Bucharest</strong> who loves building things in <strong>C++</strong>.</p>
          <p>Welcome to my little corner of the web. A place where I share my projects, experiments, and a bit of what I'm learning along the way.</p>
          <p>Have a look around and see what I've been working on!</p>
        </section>

        <Projects />

        <About />

        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}