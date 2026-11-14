import React, { useEffect, useRef } from 'react'
import { reducedMotion, useOnScreen } from '../live'

// A small software rasterizer, for show. It is not the C++ project: it is a
// JavaScript stand-in that does the same job on a 96x72 buffer so the page has
// something of the project running in it. No GPU: every pixel is decided here.
//
// Per frame: rotate the mesh, project it, cull back faces, fill each triangle
// with edge functions against a z-buffer, light it per face, then ordered-dither
// the light into two inks.

const W = 96
const H = 72
const INK = [20, 21, 26]
const LIT = [255, 255, 255]
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

// A torus: enough curvature to show the shading, few enough triangles to count.
function torus(segU = 16, segV = 9, R = 1, r = 0.44) {
    const verts = []
    for (let i = 0; i < segU; i++) {
        const u = (i / segU) * Math.PI * 2
        for (let j = 0; j < segV; j++) {
            const v = (j / segV) * Math.PI * 2
            const c = R + r * Math.cos(v)
            verts.push([c * Math.cos(u), r * Math.sin(v), c * Math.sin(u)])
        }
    }
    const tris = []
    for (let i = 0; i < segU; i++) {
        for (let j = 0; j < segV; j++) {
            const a = i * segV + j
            const b = ((i + 1) % segU) * segV + j
            const c = ((i + 1) % segU) * segV + ((j + 1) % segV)
            const d = i * segV + ((j + 1) % segV)
            tris.push([a, b, c], [a, c, d])
        }
    }
    return { verts, tris }
}

const MESH = torus()
const LIGHT = (() => {
    const l = [0.45, 0.7, -0.55]
    const n = Math.hypot(...l)
    return l.map(x => x / n)
})()

function draw(ctx, image, zbuf, shade, t) {
    const ax = t * 0.55
    const ay = t * 0.8
    const cx = Math.cos(ax), sx = Math.sin(ax)
    const cy = Math.cos(ay), sy = Math.sin(ay)

    // rotate about Y then X, push back, project
    const view = MESH.verts.map(([x, y, z]) => {
        const x1 = x * cy + z * sy
        const z1 = -x * sy + z * cy
        const y2 = y * cx - z1 * sx
        const z2 = y * sx + z1 * cx + 3.3
        return [x1, y2, z2]
    })
    const f = 2.0
    const scr = view.map(([x, y, z]) => [W / 2 + (x * f * H) / (2 * z), H / 2 - (y * f * H) / (2 * z), z])

    zbuf.fill(Infinity)
    shade.fill(0)
    let drawn = 0

    for (const [a, b, c] of MESH.tris) {
        const [x0, y0, z0] = scr[a]
        const [x1, y1, z1] = scr[b]
        const [x2, y2, z2] = scr[c]

        // signed area in screen space: back faces wind the other way
        const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)
        if (area <= 0) continue
        drawn++

        // face normal in view space, for flat lighting
        const p = view[a], q = view[b], r = view[c]
        const ux = q[0] - p[0], uy = q[1] - p[1], uz = q[2] - p[2]
        const vx = r[0] - p[0], vy = r[1] - p[1], vz = r[2] - p[2]
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
        const nl = Math.hypot(nx, ny, nz) || 1
        nx /= nl; ny /= nl; nz /= nl
        let light = -(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2])
        if (light < 0) light = -light * 0.25
        const level = 1 + Math.round(Math.min(1, 0.12 + light * 0.95) * 254)

        const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2)))
        const maxX = Math.min(W - 1, Math.ceil(Math.max(x0, x1, x2)))
        const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2)))
        const maxY = Math.min(H - 1, Math.ceil(Math.max(y0, y1, y2)))

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const px = x + 0.5, py = y + 0.5
                const w0 = (x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)
                const w1 = (x2 - px) * (y0 - py) - (x0 - px) * (y2 - py)
                const w2 = (x0 - px) * (y1 - py) - (x1 - px) * (y0 - py)
                if (w0 < 0 || w1 < 0 || w2 < 0) continue
                const z = (w0 * z0 + w1 * z1 + w2 * z2) / area
                const i = y * W + x
                if (z >= zbuf[i]) continue
                zbuf[i] = z
                shade[i] = level
            }
        }
    }

    // ordered dither: the light decides how many pixels in each 4x4 cell are lit
    const px = image.data
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = y * W + x
            const o = i * 4
            const s = shade[i]
            if (!s) { px[o + 3] = 0; continue }
            const on = (s - 1) / 254 > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16
            const col = on ? LIT : INK
            px[o] = col[0]; px[o + 1] = col[1]; px[o + 2] = col[2]; px[o + 3] = 255
        }
    }
    ctx.putImageData(image, 0, 0)
    return drawn
}

export default function Raster() {
    const canvas = useRef(null)
    const stat = useRef(null)
    const visible = useOnScreen(canvas)

    useEffect(() => {
        const ctx = canvas.current?.getContext('2d')
        if (!ctx) return
        const image = ctx.createImageData(W, H)
        const zbuf = new Float32Array(W * H)
        const shade = new Uint8Array(W * H)
        const total = MESH.tris.length
        const report = n => { if (stat.current) stat.current.textContent = `${n}/${total} tris` }

        // one still frame for reduced motion, or while off screen
        if (reducedMotion() || !visible) {
            report(draw(ctx, image, zbuf, shade, 0.9))
            return
        }

        let raf = 0
        let last = 0
        const loop = now => {
            raf = requestAnimationFrame(loop)
            const drawn = draw(ctx, image, zbuf, shade, now / 1000)
            if (now - last > 250) { last = now; report(drawn) }
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [visible])

    return (
        <figure className="raster" aria-hidden="true">
            <canvas ref={canvas} width={W} height={H} />
            <figcaption>
                <span><span ref={stat}>0/{MESH.tris.length} tris</span> · {W}x{H} · z-buffer</span>
                <span>js stand-in, the real one is C++</span>
            </figcaption>
        </figure>
    )
}
