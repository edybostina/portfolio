import React from 'react'

const posts = [
    {
        date: '2026-05-20',
        title: 'Community Bonding & Environment Setup',
        content: 'Started my GSoC journey with the Linux Foundation. Having already contributed several patches during the application period, I\'m familiar with the basics, but I spent these first weeks refining my build environment and syncing with mentors on the specific YAML schema conversion goals for the project.'
    },
    {
        date: '2026-05-28',
        title: 'OMAP Counter-32K Conversion',
        content: 'Submitted the OMAP Counter-32K conversion patch. Learning the nuances of YAML validation and navigating the upstream review process—received helpful feedback from Conor Dooley and Manorit Chawdhry. Even though college exams are taking most of my time right now, I am making sure to keep pushing patches through.'
    },
    {
        date: '2026-06-02',
        title: 'TI IVA Bindings & Technical Refinement',
        content: 'Currently working on the Texas Instruments IVA bindings conversion. This involved adding a DSP sub-node for OMAP3, allowing "ti,ivahd" as a standalone compatible for OMAP4/DRA7, and making "ti,hwmods" optional for backward compatibility. Most of my current work is WIP due to exams, but after June 19th, I\'ll go full throttle.'
    },
    {
        date: '2026-06-23',
        title: 'Exams Done. Back to the Kernel.',
        content: [
            'Okay, so exams are finally over. I handed in my last one a few days ago and honestly just sat there for a moment staring at the ceiling, that specific kind of quiet when your brain finally stops running on caffeine and anxiety. It\'s a goooood feeling.',
            'To celebrate (and decompress), I spent a few days at the beach with some friends, from the 19th up until yesterday. Exactly what I needed. Sun, salt water, and zero talk of device trees.',
            'Now I\'m fully back. I\'ve been working on a few patches locally that I haven\'t sent out yet. I want to clean them up a bit before pushing them for internal review. ',
            'The plan for the coming weeks is to pick up the pace significantly. GSoC\'s midpoint isn\'t that far away and I want to have a solid chunk of conversions done and reviewed by then. No more juggling kernel patches with exam flashcards, just one thing at a time now, and that one thing is this.',
            'More updates soon. The patches won\'t review themselves.'
        ]
    },
    {
        date: '2026-07-06',
        title: 'Midpoint: 25/50 files converted, midterm evaluations begin.',
        content: [
            '25 out of 50 files converted. Exactly halfway. The pace has been solid and I\'m happy with where things stand.',
            'The upstream process can get a bit tricky at times. Review feedback sometimes sends you back to rethink how a binding is structured, and the occasional edge case in the schema doesn\'t help. Nothing unmanageable, just something you learn to navigate.',
            'The GSoC midterm evaluations also kicked off today. Neither my mentors nor I have submitted feedback yet, so we\'ll see how that goes over the next few days. Fingers crossed.'
        ]
    }
]

export default function GSoC() {
    return (
        <section id="gsoc">
            <div className="section-heading">GSoC '26: Linux Kernel</div>
            <div className="blog-list">
                {posts.map((post, i) => (
                    <div className="blog-post" key={i}>
                        <div className="blog-header">
                            <span className="blog-title">{post.title}</span>
                            <span className="blog-date">{post.date}</span>
                        </div>
                        <div className="blog-content">
                            {Array.isArray(post.content)
                                ? post.content.map((para, j) => <p key={j} style={{ margin: j === 0 ? '0' : '10px 0 0 0' }}>{para}</p>)
                                : post.content
                            }
                        </div>
                    </div>
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
