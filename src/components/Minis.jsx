import React, { useCallback, useReducer, useRef, useState } from 'react'
import { reducedMotion, useInterval, useOnScreen } from '../live'

// Small live boxes for the project cards. Each does one real step of what its
// project does, slowly, and only while on screen.

const hex2 = n => n.toString(16).padStart(2, '0')

// ── aegis: the stream-cipher step. Plaintext XOR keystream = ciphertext. ──
const PT = [...'aegis'].map(c => c.charCodeAt(0))
const newKeystream = () => {
    const ks = new Uint8Array(PT.length)
    crypto.getRandomValues(ks)
    return [...ks]
}

export function Xor() {
    const box = useRef(null)
    const visible = useOnScreen(box)
    const [ks, setKs] = useState(() => PT.map((_, i) => (0x3c + i * 0x29) & 0xff))
    const next = useCallback(() => setKs(newKeystream()), [])
    useInterval(next, 1700, visible && !reducedMotion())

    return (
        <figure className="mini" ref={box} aria-hidden="true">
            <table className="mini-grid">
                <tbody>
                    <tr><th /><td>{[...'aegis'].map((c, i) => <span key={i}>{c}</span>)}</td></tr>
                    <tr><th>pt</th><td>{PT.map((b, i) => <span key={i}>{hex2(b)}</span>)}</td></tr>
                    <tr><th>ks</th><td>{ks.map((b, i) => <span key={i}>{hex2(b)}</span>)}</td></tr>
                    <tr className="mini-out"><th>ct</th><td>{PT.map((b, i) => <span key={i}>{hex2(b ^ ks[i])}</span>)}</td></tr>
                </tbody>
            </table>
            <figcaption>pt ^ keystream = ct</figcaption>
        </figure>
    )
}

// ── matrix-lib: Gaussian elimination on a 3x3, one row operation at a time. ──
const N = 3
const OPS = [[1, 0], [2, 0], [2, 1]] // (target row, pivot row), in order

function randomMatrix() {
    // integers, with pivots that will not vanish on the way down
    for (;;) {
        const m = Array.from({ length: N }, () => Array.from({ length: N }, () => 1 + Math.floor(Math.random() * 8)))
        const a = m.map(r => [...r])
        let ok = true
        for (const [i, j] of OPS) {
            if (Math.abs(a[j][j]) < 0.5) { ok = false; break }
            const f = a[i][j] / a[j][j]
            for (let c = 0; c < N; c++) a[i][c] -= f * a[j][c]
        }
        if (ok && Math.abs(a[2][2]) > 0.2) return m
    }
}

const FIRST = [[2, 1, 4], [6, 5, 3], [4, 7, 9]]

function elimReducer(s) {
    if (s.op >= OPS.length) {
        // rest on the finished U for a few ticks, then start a new matrix
        return s.rest < 2 ? { ...s, rest: s.rest + 1 } : { m: randomMatrix(), op: 0, rest: 0, note: '' }
    }
    const [i, j] = OPS[s.op]
    const f = s.m[i][j] / s.m[j][j]
    const m = s.m.map(r => [...r])
    for (let c = 0; c < N; c++) m[i][c] -= f * m[j][c]
    return { m, op: s.op + 1, rest: 0, note: `r${i + 1} -= ${f.toFixed(2)}·r${j + 1}`, hot: i, pivot: j }
}

const cell = x => {
    const r = Math.abs(x) < 0.005 ? 0 : x
    return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

export function Elim() {
    const box = useRef(null)
    const visible = useOnScreen(box)
    const [s, step] = useReducer(elimReducer, { m: FIRST, op: 0, rest: 0, note: '' })
    useInterval(step, 1400, visible && !reducedMotion())
    const done = s.op >= OPS.length

    return (
        <figure className="mini" ref={box} aria-hidden="true">
            <div className="mini-matrix">
                {s.m.map((row, i) => (
                    <div key={i} className={i === s.hot && !done ? 'is-hot' : i === s.pivot && !done ? 'is-pivot' : undefined}>
                        {row.map((x, c) => <span key={c}>{cell(x)}</span>)}
                    </div>
                ))}
            </div>
            <figcaption>{done ? 'upper triangular' : s.note || 'gaussian elimination'}</figcaption>
        </figure>
    )
}

// ── mos6502: five real opcodes running a counting loop. ──
//   $0600  A2 00     LDX #$00
//   $0602  E8        INX
//   $0603  8A        TXA
//   $0604  D0 FC     BNE $0602
//   $0606  4C 00 06  JMP $0600
const ROM = { 0x0600: 0xa2, 0x0601: 0x00, 0x0602: 0xe8, 0x0603: 0x8a, 0x0604: 0xd0, 0x0605: 0xfc, 0x0606: 0x4c, 0x0607: 0x00, 0x0608: 0x06 }
const nz = (p, v) => (p & ~0x82) | (v === 0 ? 0x02 : 0) | (v & 0x80)

function cpuStep(s) {
    const op = ROM[s.pc]
    switch (op) {
        case 0xa2: { const v = ROM[s.pc + 1]; return { ...s, x: v, p: nz(s.p, v), pc: s.pc + 2, cyc: s.cyc + 2, ins: `LDX #$${hex2(v)}` } }
        case 0xe8: { const v = (s.x + 1) & 0xff; return { ...s, x: v, p: nz(s.p, v), pc: s.pc + 1, cyc: s.cyc + 2, ins: 'INX' } }
        case 0x8a: return { ...s, a: s.x, p: nz(s.p, s.x), pc: s.pc + 1, cyc: s.cyc + 2, ins: 'TXA' }
        case 0xd0: {
            const off = ROM[s.pc + 1]
            const target = (s.pc + 2 + (off < 0x80 ? off : off - 0x100)) & 0xffff
            const taken = !(s.p & 0x02)
            return { ...s, pc: taken ? target : s.pc + 2, cyc: s.cyc + (taken ? 3 : 2), ins: `BNE $${target.toString(16).padStart(4, '0')}` }
        }
        default: { const target = ROM[s.pc + 1] | (ROM[s.pc + 2] << 8); return { ...s, pc: target, cyc: s.cyc + 3, ins: `JMP $${target.toString(16).padStart(4, '0')}` } }
    }
}

const FLAGS = 'NV-BDIZC'

export function Cpu6502() {
    const box = useRef(null)
    const visible = useOnScreen(box)
    const [s, step] = useReducer(cpuStep, { a: 0, x: 0, y: 0, p: 0x24, pc: 0x0600, cyc: 0, ins: 'reset' })
    useInterval(step, 420, visible && !reducedMotion())

    return (
        <figure className="mini" ref={box} aria-hidden="true">
            <dl className="mini-regs">
                <div><dt>pc</dt><dd>{s.pc.toString(16).padStart(4, '0')}</dd></div>
                <div><dt>a</dt><dd>{hex2(s.a)}</dd></div>
                <div><dt>x</dt><dd>{hex2(s.x)}</dd></div>
                <div><dt>y</dt><dd>{hex2(s.y)}</dd></div>
            </dl>
            <p className="mini-flags">
                {[...FLAGS].map((f, i) => <span key={i} className={s.p & (0x80 >> i) ? 'is-set' : undefined}>{f}</span>)}
            </p>
            <p className="mini-ins">{s.ins}</p>
            <figcaption>{s.cyc} cycles</figcaption>
        </figure>
    )
}

// ── perspicua: a syscall crossing the bus in the block diagram. ──
const SYSCALLS = ['fork()', 'exec()', 'exit()', 'waitpid()']

export function SyscallBus() {
    const box = useRef(null)
    const visible = useOnScreen(box)
    // even ticks rest on the count, odd ticks show a call going through
    const [t, bump] = useReducer(n => n + 1, 0)
    useInterval(bump, 1300, visible && !reducedMotion())
    const call = t % 2 === 1 ? SYSCALLS[((t - 1) / 2) % SYSCALLS.length] : null

    return (
        <p className={`bd-bus${call ? ' is-call' : ''}`} ref={box}>
            {call ? <><span aria-hidden="true">{call}</span><span className="sr-only">47 syscalls</span></> : '47 syscalls'}
        </p>
    )
}
