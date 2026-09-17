import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Projects from './components/Projects'
import GSoC from './components/GSoC'
import GSoCPost from './components/GSoCPost'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Boot from './components/Boot'
import Crt from './components/Crt'
import Stats from './components/Stats'
import Bento from './components/Bento'
import Shortcuts from './components/Shortcuts'
import { findPost } from './data/gsocPosts'

// Hash routing, deliberately dependency-free and GitHub Pages safe.
//   #home / #projects / #gsoc ...  -> sections on the main page (scroll anchors)
//   #/gsoc/<slug>                  -> a single blog entry on its own page
// The leading slash is what distinguishes a route from a scroll anchor.
function useHash() {
    const [hash, setHash] = useState(() => window.location.hash)
    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash)
        window.addEventListener('hashchange', onHashChange)
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [])
    return hash
}

export default function App() {
    const hash = useHash()
    const match = hash.match(/^#\/gsoc\/([^/]+)\/?$/)
    const post = match ? findPost(match[1]) : null
    const isPostRoute = Boolean(match)

    useEffect(() => {
        if (isPostRoute) {
            window.scrollTo(0, 0)
        } else if (hash && !hash.startsWith('#/')) {
            // arrived from a post page via a nav link: scroll to the section
            const el = document.getElementById(hash.slice(1))
            if (el) el.scrollIntoView({ block: 'start' })
        }
    }, [hash, isPostRoute])

    return (
        <>
        <Boot />
        <Crt />
        <Shortcuts />
        <div className="page">
            <Header />
            <main className="content">
                {isPostRoute ? (
                    post ? (
                        <GSoCPost post={post} />
                    ) : (
                        <section className="post">
                            <a className="back-link" href="#gsoc">&lt;- all entries</a>
                            <div className="post-header">
                                <h1 className="post-title">404: entry not found</h1>
                            </div>
                            <div className="post-body">
                                <p>No GSoC entry matches that address.</p>
                            </div>
                        </section>
                    )
                ) : (
                    <>
                        <section id="home">
                            <div className="badge">
                                <span className="badge-dot" />
                                open to summer 2027 internships · eu / uk
                            </div>
                            <div className="home-name">Eduard Bostina</div>
                            <div className="home-title">c developer · linux kernel contributor</div>
                            <div className="home-sub">CS @ Politehnica Bucharest · Bucharest, Romania</div>
                            <p className="home-bio">
                                I write C for things close to the metal: the Linux kernel, my own
                                OS kernel, embedded firmware, and the tooling around them. This
                                summer I did{' '}
                                <a href="https://summerofcode.withgoogle.com/" target="_blank" rel="noopener noreferrer">
                                    Google Summer of Code
                                </a>{' '}with{' '}
                                <a href="https://www.linuxfoundation.org/" target="_blank" rel="noopener noreferrer">
                                    The Linux Foundation
                                </a>, converting device tree bindings to YAML schema and reading a
                                lot of driver code to check each one actually matched the hardware.{' '}
                                <a href="https://lore.kernel.org/all/?q=egbostina@gmail.com" target="_blank" rel="noopener noreferrer">
                                    22 patches
                                </a>{' '}merged into mainline.
                            </p>

                            <div className="btn-row">
                                <a className="btn primary" href="./Eduard_Bostina_CV.pdf" target="_blank" rel="noopener noreferrer">cv.pdf</a>
                                <a className="btn" href="mailto:egbostina@gmail.com">email</a>
                                <a className="btn" href="https://github.com/edybostina" target="_blank" rel="noopener noreferrer">github</a>
                                <a className="btn" href="https://linkedin.com/in/edybostina" target="_blank" rel="noopener noreferrer">linkedin</a>
                                <a className="btn" href="https://lore.kernel.org/all/?q=egbostina@gmail.com" target="_blank" rel="noopener noreferrer">lore.kernel.org</a>
                            </div>

                            <Stats />
                        </section>

                        <Projects />
                        <Bento />
                        <GSoC />
                        <About />
                        <Contact />
                    </>
                )}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
        </>
    )
}
