import React from 'react'

// Scanlines and vignette. Purely decorative, so it is hidden from the
// accessibility tree and disabled in the light theme and under
// prefers-reduced-motion (see index.css).
export default function Crt() {
    return <div className="crt" aria-hidden="true" />
}
