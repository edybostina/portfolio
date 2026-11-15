# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: systems hiring teams.** Engineers and recruiters at embedded, kernel, and infrastructure companies screening Eduard for a summer 2027 internship in the EU or UK. Their job is to decide whether he's worth an interview. The visit succeeds when they open the CV or send an email.

**Secondary: people who share the interests.** Other systems programmers, kernel and open-source people, GSoC peers, classmates. They come for the projects and the GSoC log. They should never slow the hiring visitor's path.

## Product Purpose

This is the personal site of Eduard Bostina, a CS student at Politehnica Bucharest (UPB ACS). It is about the areas he enjoys most: C and C++, embedded work, kernel work, and the math underneath (linear algebra, rendering, numerics). It exists to land a summer 2027 systems internship (EU/UK).

It is also the permanent home of his Google Summer of Code '26 log. He did GSoC with The Linux Foundation, converting legacy devicetree `.txt` bindings to validated YAML schema. GSoC is finished; it is one chapter of the site, not its identity.

## Positioning

Listed in the order a hiring visitor should meet them:

1. **Writes C and C++ close to the hardware.** Kernels, bare metal, emulation, SIMD. This is the through-line; everything else is an instance of it.
2. **Builds from scratch.** perspicua, a 64-bit UNIX-like kernel for the Raspberry Pi 4 written with three friends, boots on real hardware to a userspace shell. The rasterizer draws without a GPU. matrix-lib does its own linear algebra.
3. **Likes the math.** Linear algebra, 3D transforms, numerics, a bit of ML. It shows up in the projects rather than as a claim.
4. **Has shipped to mainline.** 24 patches accepted into the Linux kernel through public maintainer review, from the GSoC summer. A fact that stays true and stays checkable. It is evidence, not the headline: he has not sent patches since autumn 2026, so nothing may present this as ongoing.
5. **Learns in public.** The GSoC log is candid about mistakes and review lessons.
6. **A real person.** Dry, self-deprecating humour and a life outside systems work (football, guitar, friends).

What another student portfolio can't honestly copy: the claims can be checked outside the site. Code on GitHub, patches on lore, a kernel that boots on a physical board.

## Operating Context

- Visitors check claims by following links off the site: GitHub repos (the `perspicua` org and `edybostina`), lore.kernel.org patch history, and the CV PDF. These outbound links are part of the product.
- The subject matter is low-level programming and its culture: datasheets, registers, device trees, review on mailing lists, linear algebra. The secondary audience reads the jargon fluently. The primary audience may only skim it.
- Structure: one page with the sections home, about, projects, gsoc, and contact. The GSoC log has its own page at `#/blog`, and each entry its own at `#/gsoc/<slug>`.

## Capabilities and Constraints

- **Static build on GitHub Pages.** Vite + React 19, deployed with `npm run deploy` to the `gh-pages` branch and served at https://edybostina.github.io/portfolio with `base: './'`. No backend, no analytics, no heavy dependencies.
- **Hash routing, and GSoC URLs are permanent.** `#section` is a scroll anchor. `#/gsoc/<slug>` is an entry page. The ten existing entry slugs must keep resolving. New entries add to the archive and never replace it.
- **Where content lives.** Projects are in `src/components/Projects.jsx`. Links, headline numbers, the latest patches and the "currently" list are in `src/data/site.js`. GSoC entries are in `src/data/gsocPosts.js`. The patch count is defined once, as `PATCHES_UPSTREAM` in `src/data/site.js`.
- **The copy stays (owner's instruction, 2026-11-14).** The existing text remains about the same: no major rewrites, no new claims. Small corrections for facts that have gone stale are fine. The design may change freely; there is no fixed visual rule, theme included.
- **All motion respects `prefers-reduced-motion`.**
- **Time-bound copy.** The open-to-work line ("summer 2027 internships · eu / uk"), the "currently" list and the patch count go stale. Keep them current rather than letting them drift.
- **Undecided.** What the site becomes once an internship is secured.

## Brand Commitments

- **Name and handle.** Eduard Bostina, known as `edybostina` everywhere (site title, GitHub, LinkedIn, Instagram). Project names are lowercase: perspicua, aegis, rasterizer, matrix-lib, mos6502.
- **Voice (binding).** Mostly lowercase, terse, dry, and a little self-deprecating ("not a web dev, bear with me"). GSoC entries are plain first person and honest about getting things wrong.

## Evidence on Hand

- `public/Eduard_Bostina_CV.pdf`: the CV, and the primary conversion target.
- `public/perspicua-boot.jpg`: a capture of perspicua's console after booting on a Raspberry Pi 4: the kernel log through to userspace, then kfetch. The only boot evidence on hand. No photo of the physical board.
- `public/pfp2.jpg`: not a photo of Eduard and unused. No portrait is on hand.
- GitHub: `perspicua/perspicua` (maintainer, 500+ commits), `edybostina/aegis` (five tagged releases with CI), `edybostina/rasterizer` (5.9k triangles at 1920×1080 in real time, 2.6× from tile-based multithreading; the repo has a screenshot and a demo gif), `edybostina/matrix-lib-cpp` (4–8× from SIMD on large matrices), `edybostina/mos6502` (work in progress).
- Not on the site but real: `edybostina/tinf`, a zero-dependency neural-network inference engine for microcontrollers. The one explicitly embedded-plus-math project; adding it is the owner's call.
- lore.kernel.org patch history (search on `egbostina@gmail.com`): the source for the 24 patches accepted (mainline plus linux-next, checked 30 Sep 2026).
- Headline numbers: 24 patches upstream, 16 subsystems, 39k lines of code, 47 syscalls, 9.4/10 GPA.
- The GSoC '26 log: ten entries, 2026-05-20 to 2026-08-18, in `src/data/gsocPosts.js`.
- **Absences that future work must not fill with invented content:** no testimonials, recommendations, or mentor endorsements; no employer or internship history; no press. Patches **sent** and patches **accepted** are different counts; keep each number tied to what it counts.

## Product Principles

1. **Proof over adjectives.** Every claim either links to a public source or can be checked against one. Never round up, never invent.
2. **The hiring visitor's path comes first.** Who he is, what he builds, the proof, with the CV or email one step away.
3. **The interests lead, not the résumé line.** C/C++, embedded, kernel, math. The work he would choose to do is what the page is about.
4. **Show the work, mistakes included.** Don't polish the GSoC log into marketing.
5. **A person, not a résumé.** Personality and humour stay, in the confirmed voice.
6. **Static, light, durable.** No backend, no tracking, no heavy dependencies, and published URLs never break.
