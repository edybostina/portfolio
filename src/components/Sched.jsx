import React, { useCallback, useReducer, useRef } from 'react'
import { reducedMotion, useInterval, useOnScreen } from '../live'

// About, as a process table. A round-robin scheduler over four cores with
// per-core runqueues and a wait queue, which is how perspicua schedules. The
// processes are the things the paragraph above says he does.
//
// Each tick one core switches: its running task goes to the back of its queue
// (or, now and then, to sleep) and the next one runs. Sleepers wake onto the
// shortest queue. Clicking a task stops it (SIGSTOP); clicking again continues it.

const TASKS = ['c', 'kernel', 'firmware', 'math', 'ai/ml', 'perspicua', 'upb', 'football', 'guitar', 'beer', 'reels', 'queues']
const CORES = 4
const TICK_MS = 650
const MAX_ASLEEP = 3
const HISTORY = 14 // how many past quanta each core keeps on show

const shortest = cores => cores.reduce((best, q, i) => (q.length < cores[best].length ? i : best), 0)

function init() {
    const cores = Array.from({ length: CORES }, () => [])
    TASKS.forEach((_, id) => cores[id % CORES].push(id))
    return { cores, wait: [], tick: 0, switches: Array(CORES).fill(0), ran: [] }
}

function reducer(s, a) {
    const cores = s.cores.map(q => [...q])
    let wait = [...s.wait]

    if (a.type === 'toggle') {
        const stopped = wait.find(w => w.id === a.id && w.kind === 'stop')
        if (stopped) {
            wait = wait.filter(w => w !== stopped)
            cores[shortest(cores)].push(a.id)
        } else {
            cores.forEach((q, i) => { cores[i] = q.filter(id => id !== a.id) })
            wait = wait.filter(w => w.id !== a.id)
            wait.push({ id: a.id, kind: 'stop' })
        }
        return { ...s, cores, wait }
    }

    // tick: wake whoever is due, then switch one core
    wait = wait.filter(w => {
        if (w.kind === 'sleep' && w.until <= a.now) {
            cores[shortest(cores)].push(w.id)
            return false
        }
        return true
    })
    const c = s.tick % CORES
    const switches = [...s.switches]
    let history = s.ran
    if (cores[c].length) {
        const ran = cores[c].shift()
        // what just ran joins that core's history; the oldest entry falls off
        history = [...history, { c, seq: switches[c], id: ran }].filter(h => h.c !== c || h.seq > switches[c] - HISTORY)
        const asleep = wait.filter(w => w.kind === 'sleep').length
        if (a.roll < 0.22 && asleep < MAX_ASLEEP) {
            wait.push({ id: ran, kind: 'sleep', until: a.now + 2500 + a.nap * 4500 })
        } else {
            cores[c].push(ran)
        }
        switches[c]++
    }
    return { cores, wait, tick: s.tick + 1, switches, ran: history }
}

export default function Sched() {
    const box = useRef(null)
    const visible = useOnScreen(box)
    const [s, dispatch] = useReducer(reducer, null, init)

    const tick = useCallback(
        () => dispatch({ type: 'tick', now: Date.now(), roll: Math.random(), nap: Math.random() }),
        []
    )
    useInterval(tick, TICK_MS, visible && !reducedMotion())

    // where every task is: lane (a core, or the wait lane), slot, and state
    const where = {}
    s.cores.forEach((q, lane) => q.forEach((id, k) => { where[id] = { lane, k, st: k === 0 ? 'R' : 'r', n: s.switches[lane] } }))
    s.wait.forEach((w, k) => { where[w.id] = { lane: CORES, k, st: w.kind === 'stop' ? 'T' : 'S' } })

    return (
        <div className="sched" ref={box} aria-hidden="true">
            <p className="sched-head">
                <span>sched: Initialized with 4 cores</span>
                <span>round-robin · click a task to stop it</span>
            </p>
            <div className="sched-body">
                <ol className="sched-lanes">
                    {Array.from({ length: CORES }, (_, i) => <li key={i}>cpu{i}</li>)}
                    <li>wait</li>
                </ol>
                <div className="sched-field">
                    <p className="sched-cols"><span>running</span><span>ready</span><span>ran</span></p>
                    <span className="sched-run" />
                    {s.ran.map(h => (
                        <span
                            className="ran"
                            key={`${h.c}-${h.seq}`}
                            style={{ '--lane': h.c, '--h': s.switches[h.c] - 1 - h.seq }}
                        >
                            {TASKS[h.id]}
                        </span>
                    ))}
                    {TASKS.map((name, id) => {
                        const w = where[id]
                        return (
                            <button
                                type="button"
                                tabIndex={-1}
                                key={id}
                                className={`task task--${w.st}`}
                                style={{ '--lane': w.lane, '--k': w.k }}
                                onClick={() => dispatch({ type: 'toggle', id })}
                            >
                                <span>{name}</span>
                                <i>{w.st.toUpperCase()}</i>
                                {w.st === 'R' && <b key={w.n} />}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
