import React from 'react'
import { postsByDate, monthName } from '../data/gsocPosts'
import { LINKS, RECENT_PATCHES } from '../data/site'
import Region from './Region'
import BindingDiff from './BindingDiff'

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

export default function GSoC() {
    return (
        <Region id="gsoc" perm="r--" tone="yellow">
            <h2 className="giant">gsoc '26</h2>

            <div className="gsoc-intro">
            <div className="prose">
                <p>
                    I was a Google Summer of Code '26 contributor with The Linux Foundation,
                    working directly in the mainline Linux kernel tree. My project was
                    converting the kernel's devicetree bindings from the old free-form{' '}
                    <code>.txt</code> format into validated YAML schemas (the machine-checkable
                    contracts that describe how hardware is wired up on a board).
                </p>
                <p>
                    In practice that meant writing the YAML schema, updating the{' '}
                    <code>.dts</code> device tree sources that reference each binding, and reading
                    through the relevant driver code to make sure the schema actually matched
                    what the driver expects. Every patch went through the standard upstream
                    review process on the kernel mailing lists: real maintainers, real review,
                    merged into the tree everyone runs.
                </p>
            </div>
            <BindingDiff />
            </div>

            <div className="block">
                <div className="block-head">
                    <h3 className="sub-head">latest patches</h3>
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

            <div className="block">
                <div className="block-head">
                    <h3 className="sub-head">the log</h3>
                    <span className="block-meta">{postsByDate.length} entries</span>
                </div>
                <div className="log-wrap">
                    {LOG.map(g => (
                        <div className="log-month" key={g.key}>
                            <h4 className="log-label">{g.label}</h4>
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
        </Region>
    )
}
