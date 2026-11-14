import React, { useEffect, useRef, useState } from 'react'
import { reducedMotion, useOnScreen } from '../live'

// The first conversion, converting itself: the old free-form binding is struck
// out line by line and the YAML schema arrives in its place.
//
// The lines are verbatim from the patch as sent ("dt-bindings: arm: omap:
// Convert Counter-32K to DT schema", v2), excerpted; the diffstat is the patch's.
const OLD = [
    'OMAP Counter-32K bindings',
    '',
    'Required properties:',
    '- compatible:\tMust be "ti,omap-counter32k" for OMAP controllers',
    '- reg:\t\tContains timer register address range (base address and length)',
    '- ti,hwmods:\tName of the hwmod associated to the counter, which is typically',
    '\t\t"counter_32k"',
]

const NEW = [
    'title: Texas Instruments OMAP Counter-32K',
    '',
    'properties:',
    '  compatible:',
    '    oneOf:',
    '      - const: ti,omap-counter32k',
    '      - items:',
    '          - const: ti,am4372-counter32k',
    '          - const: ti,omap-counter32k',
    '',
    '  reg:',
    '    maxItems: 1',
    '',
    '  ti,hwmods:',
    '    description: Name of the hwmod associated to the counter',
    '    $ref: /schemas/types.yaml#/definitions/string-array',
    '    items:',
    '      - const: counter_32k',
]

const TOTAL = OLD.length + NEW.length
const STEP_MS = 240
const HOLD_STEPS = 22 // how long the finished diff rests before it starts over

export default function BindingDiff() {
    const box = useRef(null)
    const visible = useOnScreen(box)
    // how many lines have been processed; TOTAL means the diff is complete
    const [step, setStep] = useState(TOTAL)
    const still = reducedMotion()

    useEffect(() => {
        if (still || !visible) return
        const id = setInterval(() => {
            setStep(s => (s >= TOTAL + HOLD_STEPS ? 0 : s + 1))
        }, STEP_MS)
        return () => clearInterval(id)
    }, [visible, still])

    const done = Math.min(step, TOTAL)

    return (
        <figure className="diff" ref={box} aria-hidden="true">
            <div className="diff-bar">
                <span>counter.txt -&gt; ti,omap-counter32k.yaml</span>
                <span>-15 +41</span>
            </div>
            <pre className="diff-body">
                <span className="diff-hunk">@@ -1,15 +0,0 @@</span>
                {OLD.map((line, i) => (
                    <span className={`diff-line${i < done ? ' is-del' : ''}`} key={`o${i}`}>
                        <i>{i < done ? '-' : ' '}</i>{line || ' '}
                    </span>
                ))}
                <span className="diff-hunk">@@ -0,0 +1,41 @@</span>
                {NEW.map((line, i) => (
                    <span className={`diff-line is-add${OLD.length + i < done ? '' : ' is-pending'}`} key={`n${i}`}>
                        <i>+</i>{line || ' '}
                    </span>
                ))}
            </pre>
        </figure>
    )
}
