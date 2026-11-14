// UART framing, shared by the name in the home region and the burst in contact.
// For each byte: a start bit (0), eight data bits least-significant first, a
// stop bit (1). The line idles high.

export const HI = 5
export const LO = 35
export const BITS_PER_FRAME = 10

export function frameBits(ch) {
    if (!ch) return Array(BITS_PER_FRAME).fill(1) // idle
    const code = ch.charCodeAt(0)
    return [0, ...Array.from({ length: 8 }, (_, i) => (code >> i) & 1), 1]
}

// The square wave for a run of characters as one SVG path, 10 units per bit.
export function wavePath(chars) {
    let d = `M0,${HI}`
    let prev = 1
    let x = 0
    chars.forEach(ch => {
        frameBits(ch).forEach(b => {
            if (b !== prev) d += ` V${b ? HI : LO}`
            x += 10
            d += ` H${x}`
            prev = b
        })
    })
    return d
}
