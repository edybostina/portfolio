import React from 'react'
import { postsByDate, monthName } from '../data/gsocPosts'
import { LINKS, RECENT_PATCHES } from '../data/site'
import Region from './Region'

// The GSoC log, on its own page at #/blog. The main page keeps the summary
// and links here; every entry still lives at its own #/gsoc/<slug>.

// Newest-first posts, grouped by month so ten entries read as four short runs.
function byMonth(posts) {
    const groups = []
    posts.forEach(post => {
        const key = post.date.slice(0, 7)
        let g = groups[groups.length - 1]
        if (!g || g.key !== key) {
            g = { key, label: `${monthName(post.date)} ${key.slice(0, 4)}`, posts: [] }
            groups.push(g)
        }
        g.posts.push(post)
    })
    return groups
}

const LOG = byMonth(postsByDate)

// 'mfd: convert TI TWL6040 to DT schema' -> ['mfd:', 'convert TI TWL6040 to DT schema']
function splitSubject(subject) {
    const i = subject.indexOf(': ')
    return i === -1 ? ['', subject] : [subject.slice(0, i + 1), subject.slice(i + 2)]
}

export default function Blog() {
    return (
        <Region id="blog" name="gsoc/log" perm="r--" tone="yellow" as="article">
            <a className="back-link" href="#gsoc">&lt;- gsoc '26</a>
            <h1 className="giant">the log</h1>

            <div className="block">
                <div className="block-head">
                    <h2 className="sub-head">gsoc '26</h2>
                    <span className="block-meta">{postsByDate.length} entries</span>
                </div>
                <div className="log-wrap">
                    {LOG.map(g => (
                        <div className="log-month" key={g.key}>
                            <h3 className="log-label">{g.label}</h3>
                            <ol className="log">
                                {g.posts.map(post => (
                                    <li key={post.slug}>
                                        <a className="log-entry" href={`#/gsoc/${post.slug}`}>
                                            <time className="log-date" dateTime={post.date}>{Number(post.date.slice(8, 10))}</time>
                                            <span className="log-text">
                                                <span className="log-title">{post.title}</span>
                                                <span className="log-summary">{post.summary}</span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </div>

            <div className="block">
                <div className="block-head">
                    <h2 className="sub-head">latest patches</h2>
                    <a className="text-btn" href={LINKS.lore} target="_blank" rel="noopener noreferrer">all on lore -&gt;</a>
                </div>
                <table className="t">
                    <thead>
                        <tr>
                            <th scope="col">date</th>
                            <th scope="col">subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_PATCHES.map(p => {
                            const [subsys, rest] = splitSubject(p.t)
                            return (
                                <tr key={p.t}>
                                    <td className="t-date">{p.d}</td>
                                    <td className="patch-subject">
                                        <span className="patch-subsys">{subsys}</span> {rest}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </Region>
    )
}
