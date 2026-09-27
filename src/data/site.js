// Single source for links and headline numbers. Anything that appears in
// more than one place on the page (the patch count, the lore link) lives
// here so it can't drift.
//
// Every number is checkable: patches from lore, the rest from the repos.

export const EMAIL = 'egbostina@gmail.com'

export const LINKS = {
    cv: `${import.meta.env.BASE_URL}Eduard_Bostina_CV.pdf`,
    email: `mailto:${EMAIL}`,
    github: 'https://github.com/edybostina',
    linkedin: 'https://linkedin.com/in/edybostina',
    instagram: 'https://instagram.com/edybostina',
    lore: 'https://lore.kernel.org/all/?q=egbostina@gmail.com',
    gsoc: 'https://summerofcode.withgoogle.com/',
    lf: 'https://www.linuxfoundation.org/',
}

export const PATCHES_MERGED = 22

export const STATS = [
    { n: String(PATCHES_MERGED), k: 'patches in mainline', href: LINKS.lore },
    { n: '16', k: 'subsystems' },
    { n: '35k', k: 'lines of kernel' },
    { n: '46', k: 'syscalls' },
    { n: '9.4/10', k: 'gpa' },
]

// Latest upstream patches, newest first. Subjects exactly as sent.
export const RECENT_PATCHES = [
    { d: '16 sep', t: 'mfd: convert TI TWL6040 to DT schema' },
    { d: '10 sep', t: 'mfd: convert TPS61050 to DT schema' },
    { d: '31 aug', t: 'input: convert TI keypad controller' },
    { d: '14 aug', t: 'pinctrl: convert TI DA850 pupd' },
]

export const NOW = [
    'scheduler work in perspicua',
    'still sending patches upstream',
    'reading about lock-free queues',
]
