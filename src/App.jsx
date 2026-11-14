import React, { useState, useEffect, useRef } from 'react'
import Rail from './components/Rail'
import Hero from './components/Hero'
import Projects from './components/Projects'
import GSoC from './components/GSoC'
import GSoCPost from './components/GSoCPost'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Shortcuts from './components/Shortcuts'
import Pet from './components/Pet'
import { findPost } from './data/gsocPosts'
import Region from './components/Region'
import { MapContext, useMemoryMap } from './memmap'

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

// The faces the layout is measured in. Loaded by name because document.fonts.ready
// resolves straight away if nothing has been requested yet.
const LAYOUT_FACES = ['400 1em "Archivo Variable"', '800 1em "Archivo Variable"', '400 1em "B612 Mono"']
const READER_INPUT = ['wheel', 'touchstart', 'keydown', 'pointerdown']

export default function App() {
    const hash = useHash()
    const match = hash.match(/^#\/gsoc\/([^/]+)\/?$/)
    const post = match ? findPost(match[1]) : null
    const isPostRoute = Boolean(match)
    const wasPost = useRef(null) // null until the first render has been handled
    const map = useMemoryMap(hash.startsWith('#/') ? hash : 'main')

    useEffect(() => {
        const firstLoad = wasPost.current === null
        const leftPost = wasPost.current === true
        wasPost.current = isPostRoute

        if (isPostRoute) {
            window.scrollTo(0, 0)
            return
        }
        // Only step in when the section wasn't on screen to scroll to: a first load
        // with a hash, or coming back from a post page. In-page anchor clicks are
        // left to the browser so they keep their smooth scroll.
        if ((firstLoad || leftPost) && hash && !hash.startsWith('#/')) {
            const el = document.getElementById(hash.slice(1))
            if (!el) return
            el.scrollIntoView({ block: 'start', behavior: 'instant' })
            // The web fonts land a few ms later and reflow everything above the
            // target, so jump once more when they do, unless the reader has taken
            // over. (Watch their input, not scrollY: the browser's own scroll
            // anchoring moves scrollY during the reflow.)
            if (firstLoad && document.fonts) {
                let tookOver = false
                const takeOver = () => { tookOver = true }
                READER_INPUT.forEach(t => window.addEventListener(t, takeOver, { passive: true }))
                Promise.all(LAYOUT_FACES.map(f => document.fonts.load(f))).then(() => {
                    READER_INPUT.forEach(t => window.removeEventListener(t, takeOver))
                    if (!tookOver) el.scrollIntoView({ block: 'start', behavior: 'instant' })
                })
            }
        }
    }, [hash, isPostRoute])

    useEffect(() => {
        document.title = post ? `${post.title} · edybostina` : 'edybostina'
    }, [post])

    return (
        <MapContext.Provider value={map}>
            <a className="skip-link" href="#main">skip to content</a>
            <Shortcuts />
            <div className="page">
                <Rail onPost={isPostRoute} />
                <main id="main" className="content">
                    {isPostRoute ? (
                        post ? (
                            <GSoCPost post={post} key={post.slug} />
                        ) : (
                            <Region id="entry" name="unmapped" perm="---" tone="paper" as="article">
                                <a className="back-link" href="#gsoc">&lt;- all entries</a>
                                <h1 className="post-title">404: entry not found</h1>
                                <div className="prose post-body">
                                    <p>No GSoC entry matches that address.</p>
                                </div>
                            </Region>
                        )
                    ) : (
                        <>
                            <Hero />
                            <Projects />
                            <GSoC />
                            <About />
                            <Contact />
                        </>
                    )}
                    <Footer />
                    <Pet />
                </main>
            </div>
        </MapContext.Provider>
    )
}
