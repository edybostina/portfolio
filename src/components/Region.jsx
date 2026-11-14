import React, { useContext } from 'react'
import { MapContext, hex } from '../memmap'

// One mapped region: a colour block with its address range and permissions on top.
export default function Region({ id, name = id, perm, tone, as = 'section', children }) {
    const r = useContext(MapContext)[id]
    return React.createElement(
        as,
        { id, 'data-region': id, className: `region region--${tone}` },
        <p className="region-head" aria-hidden="true">
            <span>{r ? `${hex(r.start)}-${hex(r.end)}` : '0x0000-0x0000'}</span>
            <span>{perm} · {name}</span>
        </p>,
        children
    )
}
