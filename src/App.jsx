import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Projects from './components/Projects'
import GSoC from './components/GSoC'
import GSoCPost from './components/GSoCPost'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
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
                            <div className="home-name">Eduard Bostina</div>
                            <div className="home-title">c developer · linux kernel contributor</div>
                            <div className="home-sub">GSoC '26 @ The Linux Foundation · CS @ Politehnica Bucharest</div>
                            <p className="home-bio">
                                I write C for things close to the metal : the Linux kernel, my own
                                OS kernel, embedded firmware, and low-level tooling. Right now I'm a
                                Google Summer of Code contributor at The Linux Foundation, mainlining
                                devicetree bindings upstream. Occasional AI work on the side.
                            </p>
                        </section>

                        <Projects />
                        <GSoC />
                        <About />
                        <Contact />
                    </>
                )}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    )
}
