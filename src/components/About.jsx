import React from 'react'

export default function About() {
    return (
        <section id="about">
            <div className="section-heading">About</div>
            <div className="about-text">
                <p>
                    I mostly write C - embedded firmware, OS kernels, and low-level systems tooling.
                    I also like working with math stuff and AI/ML.
                    I maintain perspicua, a 64-bit AArch64 kernel for the Raspberry Pi 4, and have
                    some contributions to the Linux kernel. Currently studying CS at UPB ACS.
                </p>
                <p>
                    When I'm not doing this nerd stuff, I like watching and playing football, strumming
                    the guitar, and drinking beer with my closest friends.
                </p>
            </div>
            <div className="attr-list">
                <div className="attr-row">
                    <span className="attr-label">languages</span>
                    <span className="attr-value">C  C++  Assembly  Python  Shell  CMake</span>
                </div>
                <div className="attr-row">
                    <span className="attr-label">tools</span>
                    <span className="attr-value">QEMU  GDB  libsodium  SDL2  SIMD/AVX2  git</span>
                </div>
                <div className="attr-row">
                    <span className="attr-label">interests</span>
                    <span className="attr-value">instagram reels</span>
                </div>
            </div>
        </section>
    )
}
