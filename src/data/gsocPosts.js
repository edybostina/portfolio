// GSoC '26 blog entries.
// Each post gets its own page at #/gsoc/<slug>.
// `summary` is the one-liner shown in the index on the main page.

export const posts = [
    {
        slug: 'community-bonding',
        date: '2026-05-20',
        title: 'Community Bonding & Environment Setup',
        summary: 'Getting the build environment right and syncing with mentors on the conversion goals.',
        content: [
            'Started my GSoC journey with the Linux Foundation. Having already contributed several patches during the application period, I\'m familiar with the basics, but I spent these first weeks refining my build environment and syncing with mentors on the specific YAML schema conversion goals for the project.'
        ]
    },
    {
        slug: 'omap-counter-32k',
        date: '2026-05-28',
        title: 'OMAP Counter-32K Conversion',
        summary: 'First conversion patch out the door, and a first look at the upstream review process.',
        content: [
            'Submitted the OMAP Counter-32K conversion patch. Learning the nuances of YAML validation and navigating the upstream review process. Even though college exams are taking most of my time right now, I am making sure to keep pushing patches through.'
        ]
    },
    {
        slug: 'ti-iva-bindings',
        date: '2026-06-02',
        title: 'TI IVA Bindings & Technical Refinement',
        summary: 'A DSP sub-node for OMAP3, a standalone compatible for OMAP4/DRA7, and backward compatibility.',
        content: [
            'Currently working on the Texas Instruments IVA bindings conversion. This involved adding a DSP sub-node for OMAP3, allowing "ti,ivahd" as a standalone compatible for OMAP4/DRA7, and making "ti,hwmods" optional for backward compatibility. Most of my current work is WIP due to exams, but after June 19th, I\'ll go full throttle.'
        ]
    },
    {
        slug: 'exams-done',
        date: '2026-06-23',
        title: 'Exams Done. Back to the Kernel.',
        summary: 'Exams finished, a few days at the beach, and back to a queue of patches that need cleaning up.',
        content: [
            'Okay, so exams are finally over. I handed in my last one a few days ago and honestly just sat there for a moment staring at the ceiling, that specific kind of quiet when your brain finally stops running on caffeine and anxiety. It\'s a goooood feeling.',
            'To celebrate (and decompress), I spent a few days at the beach with some friends, from the 19th up until yesterday. Exactly what I needed. Sun, salt water, and zero talk of device trees.',
            'Now I\'m fully back. I\'ve been working on a few patches locally that I haven\'t sent out yet. I want to clean them up a bit before pushing them for internal review. ',
            'The plan for the coming weeks is to pick up the pace significantly. GSoC\'s midpoint isn\'t that far away and I want to have a solid chunk of conversions done and reviewed by then. No more juggling kernel patches with exam flashcards, just one thing at a time now, and that one thing is this.',
            'More updates soon. The patches won\'t review themselves.'
        ]
    },
    {
        slug: 'midpoint',
        date: '2026-07-06',
        title: 'Midpoint: 25/50 files converted, midterm evaluations begin.',
        summary: 'Exactly halfway, and midterm evaluations kick off.',
        content: [
            '25 out of 50 files converted. Exactly halfway. The pace has been solid and I\'m happy with where things stand.',
            'The upstream process can get a bit tricky at times. Review feedback sometimes sends you back to rethink how a binding is structured, and the occasional edge case in the schema doesn\'t help. Nothing unmanageable, just something you learn to navigate.',
            'The GSoC midterm evaluations also kicked off today. Neither my mentors nor I have submitted feedback yet, so we\'ll see how that goes over the next few days. Fingers crossed :).'
        ]
    },
    {
        slug: 'bottleneck-moved-upstream',
        date: '2026-07-30',
        title: 'Almost done locally. The bottleneck moved upstream.',
        summary: 'Converting a binding and landing a binding turn out to be two very different timelines.',
        content: [
            'About 10 files left to convert. The conversions themselves have gotten pretty mechanical by now, I know the schema patterns, I know roughly what the driver code is going to tell me, and most files don\'t surprise me anymore.',
            'What I didn\'t fully appreciate at the start is that converting a binding and landing a binding are two completely different timelines. I still have a queue of finished files on my machine waiting to be sent out, and getting them through review is the slow part, not writing them.',
            'Some series come back needing rework. A maintainer points out that a property should be optional, or that I dropped a compatible string some old board still depends on, and the patch goes around again as v2, v3, sometimes further. That is the process working the way it is supposed to, it is just not quick.',
            'And sometimes it is simply quiet. Maintainers are people with their own queues and their own priorities, so a series can sit for a week or two before anyone gets to it. Not much to do about that except keep sending files and be patient.',
            'So the local work is nearly finished and the upstream work has a while left to run. Still plenty to send.'
        ]
    }
]

// newest first for display
export const postsByDate = [...posts].sort((a, b) => b.date.localeCompare(a.date))

export const findPost = (slug) => posts.find(p => p.slug === slug)
