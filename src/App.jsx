import React from 'react'
import Header from './components/Header'
import Projects from './components/Projects'
import GSoC from './components/GSoC'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
    return (
        <div className="page">
            <Header />
            <main className="content">
                <section id="home">
                    <div className="home-name">Eduard Bostina</div>
                    <div className="home-title">c developer</div>
                    <div className="home-sub">Polytechnic University of Bucharest</div>
                    <p className="home-bio">
                        I write C. Embedded stuff, OS kernels, Linux kernel contributions.
                        Occasional AI work on the side.
                    </p>
                </section>

                <Projects />
                <GSoC />
                <About />
                <Contact />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    )
}
