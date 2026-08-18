import React from 'react'
import { postsByDate } from '../data/gsocPosts'

export default function GSoC() {
    return (
        <section id="gsoc">
            <div className="section-heading">GSoC '26: Linux Kernel</div>
            <div className="about-text" style={{ marginBottom: '24px' }}>
                <p>
                    I'm a Google Summer of Code '26 contributor with The Linux Foundation,
                    working directly in the mainline Linux kernel tree. My project is
                    converting the kernel's devicetree bindings from the old free-form
                    <code> .txt</code> format into validated YAML schemas (the machine-checkable
                    contracts that describe how hardware is wired up on a board).
                </p>
                <p>
                    In practice that means writing the YAML schema, updating the
                    <code> .dts</code> device tree sources that reference each binding, and reading
                    through the relevant driver code to make sure the schema actually matches
                    what the driver expects. Every patch goes through the standard upstream
                    review process on the kernel mailing lists: real maintainers, real review,
                    merged into the tree everyone runs.
                </p>
            </div>

            <div className="blog-index">
                {postsByDate.map(post => (
                    <a className="blog-index-item" href={`#/gsoc/${post.slug}`} key={post.slug}>
                        <span className="blog-index-date">{post.date}</span>
                        <span className="blog-index-text">
                            <span className="blog-index-title">{post.title}</span>
                            <span className="blog-index-summary">{post.summary}</span>
                        </span>
                    </a>
                ))}
            </div>

            <div className="gsoc-links" style={{ marginTop: '32px', borderTop: '1px dashed var(--border)', paddingTop: '16px' }}>
                <div className="section-heading" style={{ borderBottom: 'none', marginBottom: '12px' }}>Contributions</div>
                <div className="attr-list">
                    <div className="attr-row">
                        <span className="attr-label">Lore:</span>
                        <a href="https://lore.kernel.org/all/?q=egbostina@gmail.com" target="_blank" rel="noopener noreferrer" className="project-link" style={{ marginLeft: '0' }}>
                            [patch history]
                        </a>
                    </div>
                    <div className="attr-row">
                        <span className="attr-label">Github:</span>
                        <a href="https://github.com/edybostina" target="_blank" rel="noopener noreferrer" className="project-link" style={{ marginLeft: '0' }}>
                            [profile]
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
