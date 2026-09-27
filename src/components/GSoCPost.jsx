import React from 'react'
import { posts, shortDate } from '../data/gsocPosts'

export default function GSoCPost({ post }) {
    // chronological order, so prev = older, next = newer
    const ordered = [...posts].sort((a, b) => a.date.localeCompare(b.date))
    const idx = ordered.findIndex(p => p.slug === post.slug)
    const older = idx > 0 ? ordered[idx - 1] : null
    const newer = idx < ordered.length - 1 ? ordered[idx + 1] : null

    return (
        <article className="section post">
            <div className="rail post-rail">
                <a className="back-link" href="#gsoc">&lt;- all entries</a>
                <p className="post-meta">
                    <time dateTime={post.date}>{shortDate(post.date)} {post.date.slice(0, 4)}</time>
                    <span>gsoc '26</span>
                    <span>entry {idx + 1} of {ordered.length}</span>
                </p>
            </div>

            <div className="section-body">
                <h1 className="post-title">{post.title}</h1>

                <div className="prose post-body">
                    {post.content.map((para, i) => <p key={i}>{para}</p>)}
                </div>

                <nav className="post-nav" aria-label="More entries">
                    <div>
                        {older && (
                            <a href={`#/gsoc/${older.slug}`}>
                                <span className="post-nav-label">&lt;- older</span>
                                <span className="post-nav-title">{older.title}</span>
                            </a>
                        )}
                    </div>
                    <div className="post-nav-next">
                        {newer && (
                            <a href={`#/gsoc/${newer.slug}`}>
                                <span className="post-nav-label">newer -&gt;</span>
                                <span className="post-nav-title">{newer.title}</span>
                            </a>
                        )}
                    </div>
                </nav>
            </div>
        </article>
    )
}
