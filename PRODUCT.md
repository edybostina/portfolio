# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: systems hiring teams.** Recruiters and engineers at kernel, embedded, and infrastructure companies who are screening Eduard for a summer 2027 internship in the EU or UK. Their job is to decide whether he's worth an interview. The visit succeeds when they open the CV or send an email.

**Secondary: the kernel and open-source community.** Maintainers, mentors, and GSoC peers who look him up after seeing one of his patches. They come for depth, especially the GSoC log. They should never block or slow the hiring visitor's path.

## Product Purpose

This is the personal site of Eduard Bostina, a CS student at Politehnica Bucharest (UPB ACS) who writes C close to the hardware: the Linux kernel, his own OS kernel, embedded firmware, and the tooling around them. The site exists to land a summer 2027 systems internship (EU/UK). The open-to-work status is shown on the home section.

It is also the permanent home of his Google Summer of Code '26 log. He did GSoC with The Linux Foundation, converting legacy devicetree `.txt` bindings to validated YAML schema.

## Positioning

Four claims, all confirmed as central, listed in the order a hiring visitor should meet them:

1. **Ships to mainline.** He has 22 patches merged into the mainline Linux kernel. They went through public review by real maintainers and anyone can verify them on lore.kernel.org.
2. **Builds from scratch.** He maintains perspicua, a 64-bit UNIX-like kernel for the Raspberry Pi 4 written with three friends. It boots on real hardware to a userspace shell, with SMP, virtual memory, a VFS, and its own libc.
3. **Learns in public.** The GSoC log is candid about mistakes and review lessons. It shows how he thinks, not just what shipped.
4. **A real person.** He has a dry, self-deprecating sense of humour and a life outside systems work (football, guitar, friends). He comes across as someone you'd want on the team, not just a CV.

What another student portfolio can't honestly copy is that every one of these claims can be checked outside the site: patches on lore, code on GitHub, and a kernel that boots on a physical board.

## Operating Context

- Visitors check claims by following links off the site: lore.kernel.org patch history, GitHub repos (the `perspicua` org and `edybostina`), and the CV PDF. These outbound links are part of the product, not decoration.
- The subject matter is kernel development and its culture. Terms like `dt_binding_check`, `dtbs_check`, v2/v3 revisions, Reviewed-by tags, and maintainer review on mailing lists appear in the copy. The secondary audience reads these fluently. The primary audience may only skim them.
- Structure: one page with the sections home, projects, gsoc, about, and contact, plus a separate page for each GSoC entry at `#/gsoc/<slug>`.
- On the first visit of a browser session, the hero plays a short intro in which the real perspicua boot capture prints in; it never replays that session and never blocks the page. The site has keyboard shortcuts (`?`, `g h`, `g p`, `g g`, `g a`, `g c`), all of which are also reachable by clicking.
- One theme, dark. Light mode and the theme toggle were removed on purpose (2026-09-27).

## Capabilities and Constraints

- **Static build on GitHub Pages (confirmed).** Vite + React 19, deployed with `npm run deploy` to the `gh-pages` branch and served at https://edybostina.github.io/portfolio with `base: './'`. No backend, no analytics, no heavy dependencies.
- **Hash routing, and GSoC URLs are permanent (confirmed).** `#section` is a scroll anchor. `#/gsoc/<slug>` is an entry page. The ten existing entry slugs must keep resolving. New entries add to the archive and never replace it.
- **Where content lives.** Projects are in `src/components/Projects.jsx`. Links, headline numbers, the latest patches and the "currently" list are in `src/data/site.js`. GSoC entries are in `src/data/gsocPosts.js`. The patch count is defined once, as `PATCHES_MERGED` in `src/data/site.js`, and everything that shows it reads from there.
- **Existing behaviour found in code (not separately confirmed).** Keyboard navigation is strictly additive, so everything is reachable by clicking. All motion respects `prefers-reduced-motion`.
- **Time-bound copy.** The open-to-work badge ("summer 2027 internships · eu / uk") and the "currently" and "recent upstream" lists go stale. Keep them current rather than letting them drift.
- **Undecided.** What the site becomes once an internship is secured has not been decided.

## Brand Commitments

- **Name and handle.** Eduard Bostina, known as `edybostina` everywhere (site title, GitHub, LinkedIn, Instagram). Project names are lowercase: perspicua, aegis, rasterizer, matrix-lib, mos6502.
- **Voice (confirmed, binding).** Mostly lowercase, terse, dry, and a little self-deprecating ("not a web dev, bear with me"). GSoC entries are plain first person and honest about getting things wrong. Future copy stays in this voice.

## Evidence on Hand

- `public/Eduard_Bostina_CV.pdf`: the CV, and the primary conversion target.
- `public/perspicua-boot.jpg`: a capture of perspicua's console after booting on a Raspberry Pi 4: the kernel log through to userspace, then kfetch reporting "perspicua kernel v0.1". This is the only boot evidence on hand.
- `public/pfp2.jpg`: not a photo of Eduard (it's a dog in a cowboy hat) and unused. No portrait of him is on hand.
- lore.kernel.org patch history (search on `egbostina@gmail.com`): the source for the 22 merged patches.
- GitHub: `perspicua/perspicua` (maintainer, 463 commits), `edybostina/aegis` (5 tagged releases with CI), `edybostina/rasterizer` (5.9k triangles at 1920×1080 in real time, 2.6× from tile-based multithreading), `edybostina/matrix-lib-cpp` (4–8× from SIMD on large matrices), `edybostina/mos6502-emulator` (work in progress).
- Headline stats: 22 patches upstream, 16 subsystems, 35k lines of kernel code, 46 syscalls, 9.4/10 GPA. A code comment commits that every one is checkable.
- The GSoC '26 log: ten entries, 2026-05-20 to 2026-08-18, in `src/data/gsocPosts.js`. It includes a quoted public review from a kernel maintainer.
- **Absences that future work must not fill with invented content:** no testimonials, recommendations, or mentor endorsements; no employer or internship history; no press. Patches **sent** and patches **merged** are different counts. The GSoC log cites roughly 30 sent across 19 subsystems, while the home section cites 22 merged and the stats show 16 subsystems. Keep each number tied to what it actually counts.

## Product Principles

1. **Proof over adjectives.** Every claim either links to a public source or can be checked against one. Never round up, never invent, never let "sent" pass for "merged".
2. **The hiring visitor's path comes first.** A screener should get who he is, what he builds, and the proof, with the CV or email one step away. Depth for the community is always available but never in the way.
3. **Show the work, mistakes included.** The candid learning in the GSoC log is a strength. Don't polish it into marketing.
4. **A person, not a résumé.** Personality and humour stay, in the confirmed voice.
5. **Static, light, durable.** No backend, no tracking, no heavy dependencies, and published URLs never break.
