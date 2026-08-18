import React from 'react'
import { posts } from '../data/gsocPosts'

export default function GSoCPost({ post }) {
    // chronological order, so prev = older, next = newer
    const ordered = [...posts].sort((a, b) => a.date.localeCompare(b.date))
    const idx = ordered.findIndex(p => p.slug === post.slug)
    const older = idx > 0 ? ordered[idx - 1] : null
    const newer = idx < ordered.length - 1 ? ordered[idx + 1] : null

    return (
        <article className="post">
            <a className="back-link" href="#gsoc">&lt;- all entries</a>

            <div className="post-header">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                    <span className="post-date">{post.date}</span>
                    <span className="post-tag">gsoc '26 · linux kernel</span>
                </div>
            </div>

            <div className="post-body">
                {post.content.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <nav className="post-nav">
                <div className="post-nav-side">
                    {older && (
                        <a href={`#/gsoc/${older.slug}`}>
                            <span className="post-nav-label">&lt;- older</span>
                            <span className="post-nav-title">{older.title}</span>
                        </a>
                    )}
                </div>
                <div className="post-nav-side post-nav-right">
                    {newer && (
                        <a href={`#/gsoc/${newer.slug}`}>
                            <span className="post-nav-label">newer -&gt;</span>
                            <span className="post-nav-title">{newer.title}</span>
                        </a>
                    )}
                </div>
            </nav>
        </article>
    )
}
