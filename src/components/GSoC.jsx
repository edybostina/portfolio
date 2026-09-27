import React from 'react'
import { postsByDate, monthName } from '../data/gsocPosts'
import { LINKS, RECENT_PATCHES } from '../data/site'
import usePrintIn from '../hooks/usePrintIn'

// Newest-first posts, grouped by month so ten entries read as four short runs.
// `line` is each row's position in print order; a month label prints with its first entry.
function byMonth(posts) {
    const groups = []
    posts.forEach((post, line) => {
        const key = post.date.slice(0, 7)
        let g = groups[groups.length - 1]
        if (!g || g.key !== key) {
            g = { key, line, label: `${monthName(post.date)} ${key.slice(0, 4)}`, posts: [] }
            groups.push(g)
        }
        g.posts.push({ post, line })
    })
    return groups
}

const LOG = byMonth(postsByDate)

// 'mfd: convert TI TWL6040 to DT schema' -> ['mfd:', 'convert TI TWL6040 to DT schema']
function splitSubject(subject) {
    const i = subject.indexOf(': ')
    return i === -1 ? ['', subject] : [subject.slice(0, i + 1), subject.slice(i + 2)]
}

export default function GSoC() {
    const patchesRef = usePrintIn('patches')
    const logRef = usePrintIn('log')

    return (
        <section id="gsoc" className="section">
            <h2 className="rail">gsoc '26</h2>

            <div className="section-body">
                <div className="prose">
                    <p>
                        I'm a Google Summer of Code '26 contributor with The Linux Foundation,
                        working directly in the mainline Linux kernel tree. My project is
                        converting the kernel's devicetree bindings from the old free-form{' '}
                        <code>.txt</code> format into validated YAML schemas (the machine-checkable
                        contracts that describe how hardware is wired up on a board).
                    </p>
                    <p>
                        In practice that means writing the YAML schema, updating the{' '}
                        <code>.dts</code> device tree sources that reference each binding, and reading
                        through the relevant driver code to make sure the schema actually matches
                        what the driver expects. Every patch goes through the standard upstream
                        review process on the kernel mailing lists: real maintainers, real review,
                        merged into the tree everyone runs.
                    </p>
                </div>

                <div className="block">
                    <div className="block-head">
                        <h3>latest patches</h3>
                        <a href={LINKS.lore} target="_blank" rel="noopener noreferrer">all on lore -&gt;</a>
                    </div>
                    <ul className="patches" data-print ref={patchesRef}>
                        {RECENT_PATCHES.map((p, i) => {
                            const [subsys, rest] = splitSubject(p.t)
                            return (
                                <li key={p.t} className="print-line" style={{ '--line': i }}>
                                    <span className="patch-date">{p.d}</span>
                                    <span className="patch-subject">
                                        <span className="patch-subsys">{subsys}</span> {rest}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="block">
                    <div className="block-head">
                        <h3>the log</h3>
                        <span className="block-meta">{postsByDate.length} entries</span>
                    </div>
                    <div data-print ref={logRef}>
                        {LOG.map(g => (
                            <div className="log-month" key={g.key}>
                                <h4 className="log-label print-line" style={{ '--line': g.line }}>{g.label}</h4>
                                <ol className="log">
                                    {g.posts.map(({ post, line }) => (
                                        <li key={post.slug} className="print-line" style={{ '--line': line }}>
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
            </div>
        </section>
    )
}
