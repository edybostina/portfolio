// Authored, deterministic scenes. Time is the only input, so every transition
// can be inspected with the scrubber. These are explanatory studies, not traces.
export const SCENES = {
  pixel: {
    duration: 24,
    title: 'From a surface to a single sample.',
    description: 'A rotating torus opens into its triangle mesh. Follow one face into a coverage grid, separate the depth layers, then pull back through the framebuffer to the object you started with. The geometry, sample coverage, and framebuffer are calculated in the page.',
    chapters: [
      { t: 0, preview: 1.5, name: 'surface', caption: 'A surface, made of triangles.' },
      { t: 4, preview: 5.8, name: 'mesh', caption: 'Keep your eye on the yellow triangle.' },
      { t: 8, preview: 11.7, name: 'coverage', caption: 'Which sample points belong to this triangle?' },
      { t: 13, preview: 15.2, name: 'depth', caption: 'At each pixel, the nearest surface wins.' },
      { t: 18, preview: 20.8, name: 'framebuffer', caption: 'All those decisions become an image.' },
    ],
  },
  boot: {
    duration: 13,
    ambient: true,
    title: 'One transistor. Then a whole machine.',
    description: 'It opens on a single transistor switching with the clock. The camera pulls back through rows of logic, across a core, out of the processor and onto the board, where memory assembles around it. Four cores come online, userspace lifts above the hardware, and a serial connection delivers perspicua’s shell; the machine keeps quietly running underneath. The architecture is schematic, with console lines from your real boot capture.',
    chapters: [
      { t: 0, preview: 0.5, name: 'transistor', caption: 'Every operation begins with an edge.' },
      { t: 1.7, preview: 2.6, name: 'zoom out', caption: 'Rows of logic. A core. A processor.' },
      { t: 4.3, preview: 5.6, name: 'memory', caption: 'An empty address space starts to take shape.' },
      { t: 6.1, preview: 7.3, name: 'four cores', caption: 'The machine begins to execute.' },
      { t: 8.5, preview: 10, name: 'userspace', caption: 'Hardware below. Processes above.' },
      { t: 11, preview: 12.3, name: 'shell', caption: 'perspicua:/$ — the machine is yours.' },
    ],
  },
  byte: {
    duration: 24,
    title: 'One character. All the way down.',
    description: 'Follow the “e” in a write call across the kernel boundary, through a schematic transmit queue, and onto a serial wire. The UART frame encodes 0x65 as 8N1, least-significant bit first. At the other end, those voltage levels become a character again.',
    chapters: [
      { t: 0, preview: 1, name: 'write()', caption: 'It starts with one character: e.' },
      { t: 4, preview: 6.2, name: 'syscall', caption: 'A byte crosses the userspace boundary.' },
      { t: 8, preview: 9.5, name: 'tx queue', caption: 'Waiting for the device to be ready.' },
      { t: 12, preview: 13.7, name: 'bits', caption: '0x65 → 1 0 1 0 0 1 1 0, least-significant bit first.' },
      { t: 16, preview: 18.7, name: 'signal', caption: 'Start bit. Eight data bits. Stop bit.' },
      { t: 20, preview: 23.2, name: 'receive', caption: 'The signal becomes a character again.' },
    ],
  },
}

export const C = { bg: '#5a35d5', ink: '#14151a', white: '#ffffff', pale: '#ddd3fb', yellow: '#ffd84a', orange: '#ff4b1f' }
const TAU = Math.PI * 2
const MONO = '"B612 Mono", monospace'
const SANS = '"Archivo Variable", sans-serif'
let sceneScale = 1
// 1 / camera zoom. Strokes, dots and labels are multiplied by it, so they keep
// their size on screen while the world under them is magnified.
let k = 1
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x))
const mix = (a, b, t) => a + (b - a) * t
// Equivalent to a symmetric exponential ease; used for camera moves, not UI.
const ease = x => { const t = clamp(x); return t === 0 || t === 1 ? t : t < .5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2 }
const phase = (t, a, b) => ease((t - a) / (b - a))
const vMix = (a, b, t) => a.map((v, i) => mix(v, b[i], t))

function group(ctx, alpha, fn) {
  if (alpha <= .001) return
  ctx.save(); ctx.globalAlpha *= clamp(alpha); fn(); ctx.restore()
}
function polygon(ctx, pts, fill, stroke, width = 1) {
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath()
  if (fill) { ctx.fillStyle = fill; ctx.fill() }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width * k; ctx.stroke() }
}
function line(ctx, pts, color = C.pale, width = 1) {
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = color; ctx.lineWidth = width * k; ctx.stroke()
}
function text(ctx, str, x, y, size = 11, color = C.pale, align = 'left', sans = false) {
  const readableSize = Math.max(size, 11 / sceneScale)
  ctx.font = `${sans ? '650' : '400'} ${readableSize}px ${sans ? SANS : MONO}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color
  if (k === 1) { ctx.fillText(str, x, y); return }
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillText(str, 0, 0); ctx.restore()
}
function dot(ctx, x, y, r = 3, color = C.yellow) { ctx.beginPath(); ctx.arc(x, y, r * k, 0, TAU); ctx.fillStyle = color; ctx.fill() }
function rect(ctx, x, y, w, h, fill, stroke) {
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h) }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = k; ctx.strokeRect(x, y, w, h) }
}
function ruleLabel(ctx, label, x, y, length = 60) { line(ctx, [[x, y], [x + length, y]], 'rgba(221,211,251,.5)'); text(ctx, label, x + length + 9, y, 10) }

// A small software renderer: transforms, triangle shading, and a z-buffer.
const vertices = [], faces = []
for (let u = 0; u < 32; u++) for (let v = 0; v < 14; v++) {
  const a = u / 32 * TAU, b = v / 14 * TAU, radius = 1.2 + .48 * Math.cos(b)
  vertices.push([radius * Math.cos(a), radius * Math.sin(a), .48 * Math.sin(b)])
}
for (let u = 0; u < 32; u++) for (let v = 0; v < 14; v++) {
  const a = u * 14 + v, b = ((u + 1) % 32) * 14 + v, c = ((u + 1) % 32) * 14 + (v + 1) % 14, d = u * 14 + (v + 1) % 14
  faces.push([a, b, c], [a, c, d])
}
function geometry(t) {
  const a = .68 + t * .12, b = .5 + t * .18
  const transformed = vertices.map(([x, y, z]) => {
    const yy = y * Math.cos(a) - z * Math.sin(a), zz = y * Math.sin(a) + z * Math.cos(a)
    return [x * Math.cos(b) + zz * Math.sin(b), yy, -x * Math.sin(b) + zz * Math.cos(b)]
  })
  return faces.map((face, i) => {
    const pts = face.map(j => transformed[j]), ab = pts[1].map((v, k) => v - pts[0][k]), ac = pts[2].map((v, k) => v - pts[0][k])
    const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]], len = Math.hypot(...n)
    const light = clamp((n[0] * -.25 + n[1] * -.45 + n[2] * .86) / len * .65 + .35, .07, 1)
    return { i, pts: pts.map(([x, y, z]) => [x * 143, y * 143, z]), z: pts.reduce((s, p) => s + p[2], 0) / 3, light }
  }).sort((a, b) => a.z - b.z)
}
const frozen = geometry(3.3)
const featured = frozen.filter(f => f.z > .65).reduce((best, f) => {
  const score = Math.abs(f.pts[0][0] - 105) + Math.abs(f.pts[0][1] + 70)
  return score < best.score ? { score, face: f } : best
}, { score: Infinity }).face
function mesh(ctx, geo, solid, wire) {
  for (const f of geo) {
    const light = .15 + f.light * .8, rgb = [90, 53, 213].map(v => Math.round(mix(v, 255, light)))
    if (solid > .001) polygon(ctx, f.pts, `rgba(${rgb.join(',')},${solid})`, null)
    if (wire > .001) polygon(ctx, f.pts, null, `rgba(221,211,251,${wire * (.1 + clamp((f.z + 1.8) / 3.6) * .57)})`, .65)
  }
}
function barycentric(p, tri) {
  const [a, b, c] = tri, den = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
  if (Math.abs(den) < .00001) return null
  const u = ((b[1] - c[1]) * (p[0] - c[0]) + (c[0] - b[0]) * (p[1] - c[1])) / den
  const v = ((c[1] - a[1]) * (p[0] - c[0]) + (a[0] - c[0]) * (p[1] - c[1])) / den
  return u >= 0 && v >= 0 && u + v <= 1 ? [u, v, 1 - u - v] : null
}
const raster = (() => {
  const size = 58, cells = new Float32Array(size * size), depths = new Float32Array(size * size).fill(-Infinity)
  for (const f of frozen) {
    const pts = f.pts.map(([x, y, z]) => [(x + 260) / 520 * size, (y + 260) / 520 * size, z])
    const x0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[0])))), x1 = Math.min(size - 1, Math.ceil(Math.max(...pts.map(p => p[0]))))
    const y0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[1])))), y1 = Math.min(size - 1, Math.ceil(Math.max(...pts.map(p => p[1]))))
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const bc = barycentric([x + .5, y + .5], pts)
      if (!bc) continue
      const z = bc.reduce((s, v, i) => s + v * pts[i][2], 0), idx = y * size + x
      if (z > depths[idx]) { depths[idx] = z; cells[idx] = f.light * .8 + .15 }
    }
  }
  return { size, cells }
})()

function pixel(ctx, t) {
  const wire = phase(t, 2.8, 5.4), dive = phase(t, 6.1, 8.6), sample = phase(t, 8.6, 10.8), depth = phase(t, 12.8, 14.5), collapse = phase(t, 16.2, 17.7), image = phase(t, 18.1, 20.1), resolve = phase(t, 21, 23.6)
  group(ctx, 1 - dive, () => {
    ctx.save(); ctx.rotate(-dive * .2); ctx.scale(1 + dive * 1.4, 1 + dive * 1.4)
    mesh(ctx, t < 3.3 ? geometry(t) : frozen, 1 - wire, wire)
    ctx.restore()
    group(ctx, wire, () => { ruleLabel(ctx, 'triangle mesh', 145, -216, 30); text(ctx, '448 vertices / 896 triangles', -180, 252, 10) })
  })
  const target = [[-192, 152], [-56, -198], [225, 116]]
  const tri = featured.pts.map((p, i) => vMix(p.slice(0, 2), target[i], dive))
  group(ctx, wire * (1 - image), () => {
    const separation = depth * (1 - collapse)
    for (let layer = 2; layer >= 0; layer--) {
      const shift = layer * separation, pts = tri.map(([x, y]) => [x + shift * 35, y - shift * 39])
      group(ctx, layer === 0 ? 1 : separation * .55, () => {
        polygon(ctx, pts, layer === 0 ? 'rgba(255,216,74,.08)' : 'rgba(221,211,251,.05)', layer === 0 ? C.yellow : C.pale, layer === 0 ? 2 : 1)
        if (layer) text(ctx, `z = ${layer === 2 ? '.74' : '.51'}`, pts[2][0] + 8, pts[2][1], 10)
      })
    }
    if (separation > .01) tri.forEach(([x, y]) => line(ctx, [[x, y], [x + separation * 70, y - separation * 78]], 'rgba(221,211,251,.35)'))
    tri.forEach(([x, y], i) => { dot(ctx, x, y, 4); group(ctx, dive, () => text(ctx, `v${i}`, x + 12, y - 13, 10, C.yellow)) })
    group(ctx, sample, () => {
      const step = 21, sweep = mix(-230, 255, phase(t, 9.1, 12.1))
      for (let x = -252; x <= 252; x += step) for (let y = -231; y <= 210; y += step) {
        const inside = barycentric([x, y], target)
        if (inside && x < sweep) {
          group(ctx, .2 + collapse * .6, () => rect(ctx, x - step / 2 + 1, y - step / 2 + 1, step - 2, step - 2, C.yellow))
          dot(ctx, x, y, 2, C.yellow)
        } else dot(ctx, x, y, 1, 'rgba(221,211,251,.35)')
      }
      if (t < 12.3) { line(ctx, [[sweep, -242], [sweep, 220]], C.white, 1); text(ctx, 'sample coverage', sweep + 9, -252, 10) }
      if (t > 13) text(ctx, collapse > .8 ? 'depth test passed' : 'nearest visible sample', -200, 253, 11, C.yellow)
    })
  })
  group(ctx, image * (1 - resolve), () => {
    const { size, cells } = raster, step = 520 / size, gap = mix(1.8, .05, resolve)
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const value = cells[y * size + x]
      if (!value) continue
      rect(ctx, x * step - 260 + gap / 2, y * step - 260 + gap / 2, step - gap, step - gap, `rgba(255,255,255,${value})`)
    }
    text(ctx, 'framebuffer / 58 × 58', -220, 265, 11)
    const corner = 275
    for (const s of [-1, 1]) for (const r of [-1, 1]) line(ctx, [[s * corner, r * (corner - 12)], [s * corner, r * corner], [s * (corner - 12), r * corner]], C.pale)
  })
  group(ctx, resolve, () => { mesh(ctx, frozen, 1, 0); ruleLabel(ctx, 'back to the surface', 80, 240, 30) })
}

// Trace the same signal through each stage. A short bright tail makes the
// direction legible without glow or flashes; all geometry stays scrubbable.
function machineTrace(ctx, points, amount, width = 1.6, color = C.yellow) {
  const lengths = points.slice(1).map((p,i) => Math.hypot(p[0]-points[i][0],p[1]-points[i][1]))
  const total = lengths.reduce((a,b) => a+b,0), end = clamp(amount)*total
  let travelled = 0
  const lit = [points[0]]
  for (let i=0;i<lengths.length;i++) {
    if (travelled+lengths[i] >= end) {
      lit.push(vMix(points[i],points[i+1],lengths[i] ? (end-travelled)/lengths[i] : 0))
      break
    }
    lit.push(points[i+1]); travelled += lengths[i]
  }
  if (end > 0) { line(ctx,lit,color,width); dot(ctx,...lit[lit.length-1],width+1.2,color) }
}
function machinePacket(ctx, points, progress, color = C.yellow) {
  group(ctx,.15,()=>line(ctx,points,color,1))
  const lengths = points.slice(1).map((p,i) => Math.hypot(p[0]-points[i][0],p[1]-points[i][1]))
  const total = lengths.reduce((a,b) => a+b,0), head = progress*total, tail = Math.max(0,head-34*k)
  let distance = 0
  for (let i=0;i<lengths.length;i++) {
    const len=lengths[i],start=Math.max(tail,distance),end=Math.min(head,distance+len)
    if (end>start && len>0) {
      const a=vMix(points[i],points[i+1],(start-distance)/len),b=vMix(points[i],points[i+1],(end-distance)/len)
      line(ctx,[a,b],color,2)
      if (end===head) dot(ctx,...b,2.4,color)
    }
    distance+=len
  }
}
const machineShade = (amount, target = [255,255,255]) => `rgb(${[90,53,213].map((v,i)=>Math.round(mix(v,target[i],amount))).join(',')})`

function boot(ctx, t) {
  // The sequence was authored on a 26 second clock. T is that clock, run
  // faster: the staging is unchanged, it just takes half as long. Anything
  // that keeps looping (packets, pulses) still reads real time, t.
  const T = t <= 5 ? t * 1.28 : 6.4 + (t - 5) * 2.45
  const coreReveal=phase(T,8.6,11.1)
  const userspace=phase(T,14.7,18.1), terminal=phase(T,20.8,22.7)
  const angle=Math.PI/4+mix(-.11,.1,phase(T,5,21)), pitch=.47
  const zoom=mix(1.08,.98,phase(T,13.5,21)), vertical=90
  // The camera settles at the shell. Only signals and execution continue.
  const project=(x,y,z=0)=>[(x*Math.cos(angle)-y*Math.sin(angle))*1.16*zoom,((x*Math.sin(angle)+y*Math.cos(angle))*pitch-z)*zoom+vertical]
  const surface=(x,y,w,h,z,fill,stroke)=>{
    const p=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]].map(v=>project(...v))
    polygon(ctx,p,fill,stroke);return p
  }
  const block=(x,y,w,h,z,height,fill=machineShade(.08),edge=machineShade(.45))=>{
    const bottom=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]].map(v=>project(...v))
    const top=[[x,y,z+height],[x+w,y,z+height],[x+w,y+h,z+height],[x,y+h,z+height]].map(v=>project(...v))
    polygon(ctx,[bottom[1],bottom[2],top[2],top[1]],machineShade(.25,[20,21,26]),edge)
    polygon(ctx,[bottom[2],bottom[3],top[3],top[2]],machineShade(.12,[20,21,26]),edge)
    polygon(ctx,top,fill,edge);return top
  }
  const callout=(point,label,dx,dy,color=C.pale)=>{
    const elbow=[point[0]+dx*.5,point[1]+dy],end=[point[0]+dx,point[1]+dy]
    line(ctx,[point,elbow,end],machineShade(.38),1)
    dot(ctx,...point,2,color)
    text(ctx,label,end[0]+(dx<0?-8:8),end[1],11,color,dx<0?'right':'left')
  }

  // ── the camera ──────────────────────────────────────────────────────
  // It opens on one transistor on the die and pulls back in one continuous
  // move: through the rows of logic around it, across the core, out over the
  // processor and onto the board. The zoom runs evenly in powers, so every
  // scale gets its moment on screen.
  const FOCUS=[-42.4,-48.1,40.7]            // the transistor, in board units
  const pull=clamp((t-.7)/4), eased=(1-Math.cos(pull*Math.PI))/2
  const K=Math.exp(Math.log(520)*(1-eased)) // 520x at the start, 1x at rest
  const eye=project(...FOCUS)
  // how much of each scale is on show, by zoom rather than by time
  const between=(a,b)=>clamp((Math.log(K)-Math.log(a))/(Math.log(b)-Math.log(a)))
  const transistor=between(40,130), logic=between(3.5,9)*(1-between(260,440)*.4), memory=1-between(4,12)

  ctx.save();ctx.translate(...eye);ctx.scale(K,K);ctx.translate(-eye[0],-eye[1])
  k=1/K

  // The board's clock route. It carries the same signal the transistor is
  // switching on; you only see it once the camera is far enough out.
  const clock=[]
  for(let i=0;i<6;i++) {
    const x=-180+i*60
    for(const point of [[x,12],[x,-18],[x+30,-18],[x+30,12],[x+60,12]]) clock.push(project(point[0],point[1],7))
  }

  group(ctx,memory,()=>{
    // Board thickness, mounting points and a sparse, routed component layout.
    block(-205,-205,410,410,-12,14,machineShade(.08,[20,21,26]),machineShade(.48))
    surface(-195,-195,390,390,3,null,machineShade(.2))
    for(const x of [-184,184]) for(const y of [-184,184]) {
      const p=project(x,y,4);dot(ctx,...p,5,machineShade(.38));dot(ctx,...p,2.4,C.bg)
    }
    for(let i=0;i<11;i++) {
      const p=-150+i*30
      surface(p,-200,13,4,5,machineShade(.55),null)
      surface(-200,p,4,13,5,machineShade(.55),null)
    }
    // Fine parallel routes connect the memory banks to the processor package.
    for(const sx of [-1,1]) for(const sy of [-1,1]) for(let lane=0;lane<5;lane++) {
      const x=sx*(99+lane*5),y=sy*(126+lane*3)
      const route=[[x,y,5],[x,sy*(91-lane*4),5],[sx*(68-lane*7),sy*(91-lane*4),5],[sx*(68-lane*7),sy*78,5]].map(v=>project(...v))
      line(ctx,route,machineShade(.3),.8)
      if(lane===2) machinePacket(ctx,route,(t*.25+(sx+sy+2)*.13)%1)
    }
    // Eight memory packages, their cells appearing in a travelling wave.
    const banks=[[-172,-157],[-104,-157],[42,-157],[110,-157],[-172,112],[-104,112],[42,112],[110,112]]
    for(let i=0;i<banks.length;i++) {
      const [x,y]=banks[i],born=phase(T,4.5+i*.16,6.1+i*.16),height=12*born
      group(ctx,born,()=>{
        block(x,y,60,42,4,height,machineShade(.14),machineShade(.48))
        for(let col=0;col<6;col++) for(let row=0;row<3;row++) {
          const energy=(Math.sin(t*1.8-i*.6-col*.5-row*.4)+1)/2
          surface(x+5+col*8.5,y+5+row*10,6,7,4+height+.2,energy>.8?machineShade(.7,[255,216,74]):machineShade(.14+energy*.15),null)
        }
        for(let pin=0;pin<5;pin++) for(const side of [-1,1]) {
          const yy=side<0?y-3:y+43
          surface(x+7+pin*10,yy,4,3,4,machineShade(.6),null)
        }
      })
    }
    // Small passive components make scale readable without decorative noise.
    for(let i=0;i<7;i++) for(const side of [-1,1]) {
      const x=side*163,y=-83+i*24
      block(x,y,11,15,4,4,machineShade(i%3===0?.45:.19),machineShade(.3))
    }
  })

  group(ctx,memory,()=>{
    line(ctx,clock,machineShade(.32),1)
    machinePacket(ctx,clock,(t*.32)%1)
  })

  // The processor is there from the first frame: the camera starts inside it.
  group(ctx,1,()=>{
    // Ceramic carrier and pins. The lid lifts to reveal the die beneath it.
    const z=8
    block(-84,-84,168,168,z,17,machineShade(.06,[20,21,26]),machineShade(.65))
    for(let pin=0;pin<12;pin++) {
      const n=-70+pin*12
      for(const side of [-1,1]) {
        surface(n,side<0?-94:85,5,9,11,machineShade(.7),null)
        surface(side<0?-94:85,n,9,5,11,machineShade(.7),null)
      }
    }
    surface(-75,-75,150,150,26,machineShade(.12,[20,21,26]),machineShade(.32))
    for(let i=0;i<4;i++) {
      const x=i%2*70-65,y=Math.floor(i/2)*70-65,online=phase(T,9+i*.44,10.2+i*.44)
      const pulse=(Math.sin(t*2.1-i*1.7)+1)/2
      block(x,y,60,60,27,8+online*5,machineShade(.1+online*.1),machineShade(.4+online*.3))
      for(let row=0;row<4;row++) for(let col=0;col<4;col++) {
        const on=(row+col+Math.floor(t*1.5+i))%5===0
        surface(x+5+col*13,y+5+row*9,10,6,40.5,online && on?machineShade(.65+pulse*.3,[255,216,74]):machineShade(.14+online*.16),null)
      }
      const label=project(x+30,y+49,41)
      text(ctx,String(i),...label,12,online>.8?C.yellow:C.pale,'center')
      group(ctx,online,()=>{
        const route=[[x+30,y+30,26],[x+30,0,26],[0,0,26]].map(v=>project(...v))
        machinePacket(ctx,route,(t*.38+i*.23)%1)
      })
    }
  })

  // ── inside the die ──────────────────────────────────────────────────
  // Three scales, each a real thing at that size: rows of standard cells
  // across every block of the cores, the individual cells in the block the
  // camera starts in, and one transistor inside one of those cells.
  const dieZ=40.7, clockHigh=Math.floor(t*2.4)%2===0
  group(ctx,logic,()=>{
    for(let core=0;core<4;core++) {
      const cx=core%2*70-65,cy=Math.floor(core/2)*70-65
      for(let row=0;row<4;row++) for(let col=0;col<4;col++) {
        const x=cx+5+col*13,y=cy+5+row*9
        for(let r=0;r<7;r++) surface(x+.15,y+.2+r*.8,9.7,.55,dieZ,machineShade(.2+((r+col)%3)*.05),null)
      }
    }
    // the block the camera starts in: its rows resolve into single cells
    for(let r=0;r<7;r++) for(let c=0;c<14;c++) {
      const here=r===3&&c===6
      surface(-47+.15+c*.7,-51+.2+r*.8,.5,.55,dieZ+.01,here?machineShade(.1,[20,21,26]):machineShade(.3+((r*5+c*3)%4)*.06),here?machineShade(.8):null)
    }
  })
  group(ctx,transistor,()=>{
    // One MOSFET, seen from above: a strip of diffusion with a gate across
    // it. When the clock is high the gate is lit and the channel conducts.
    const x=-47+.15+6*.7,y=-51+.2+3*.8,z=dieZ+.02
    surface(x+.05,y+.17,.4,.21,z,machineShade(clockHigh?.5:.28),machineShade(.7))           // diffusion
    surface(x+.215,y+.08,.07,.39,z+.001,clockHigh?C.yellow:machineShade(.75),null)           // gate
    for(const sx of [.1,.36]) surface(x+sx,y+.235,.05,.08,z+.002,C.white,null)              // contacts
    // metal: the clock comes in on the gate, source and drain leave sideways
    const gateIn=[[x+.25,y-.6,z],[x+.25,y+.08,z]].map(v=>project(...v))
    line(ctx,gateIn,machineShade(.6),1.5)
    machinePacket(ctx,gateIn,(t*1.2)%1)
    line(ctx,[[x+.125,y+.275,z],[x-.5,y+.275,z]].map(v=>project(...v)),machineShade(.6),1.5)
    line(ctx,[[x+.385,y+.275,z],[x+1,y+.275,z]].map(v=>project(...v)),machineShade(.6),1.5)
    const tag=(px,py,label,dx,dy,color=C.pale)=>{ const p=project(px,py,z); line(ctx,[p,[p[0]+dx*k,p[1]+dy*k]],machineShade(.45),1); text(ctx,label,p[0]+(dx+(dx<0?-8:8))*k,p[1]+dy*k,11,color,dx<0?'right':'left') }
    tag(x+.25,y+.1,clockHigh?'gate · clock high':'gate · clock low',70,-58,C.yellow)
    tag(x+.125,y+.3,'source',-80,40)
    tag(x+.385,y+.3,'drain',80,52)
  })

  // The software layer grows from the processor's footprint. Its buses stay
  // attached to the cores throughout the lift; the camera never cuts away.
  group(ctx,userspace,()=>{
    const z=mix(48,194,userspace)-terminal*17
    const endpoints=[[-100,-65],[100,-65],[-100,65],[100,65]]
    for(let i=0;i<endpoints.length;i++) {
      const [x,y]=endpoints[i]
      const bus=[project(x*.55,y*.55,42),project(x*.55,y*.55,z-24),project(x,y,z)]
      line(ctx,bus,machineShade(.37),1)
      machinePacket(ctx,bus,(t*.24+i*.24)%1,i%2?C.white:C.yellow)
    }
    const size=mix(150,286,userspace)
    block(-size/2,-94,size,188,z-3,3,machineShade(.04),machineShade(.8))
    for(let i=0;i<10;i++) {
      surface(-128+i*26,-82,12,2,z+1,machineShade(.4),null)
      surface(-128+i*26,80,12,2,z+1,machineShade(.4),null)
    }
    const spawn=phase(T,17.2,19.4)
    const init=project(-65,3,z+14),shell=project(65,3,z+14)
    group(ctx,.4,()=>line(ctx,[init,shell],C.yellow))
    machinePacket(ctx,[init,shell],(t*.3)%1)
    block(-104,-27,78,58,z+1,10,machineShade(.12),C.yellow)
    text(ctx,'init',...init,15,C.white,'center')
    group(ctx,spawn,()=>{
      block(26,-27,78,58,z+1,10,machineShade(.22,[255,216,74]),C.yellow)
      text(ctx,'sh',...shell,15,C.yellow,'center')
    })
    group(ctx,1-terminal,()=>callout(project(-143,65,z),'userspace',-38,-15,C.white))
  })

  group(ctx,phase(T,6.5,7.5)*(1-phase(T,13.5,15)),()=>callout(project(-172,154,17),'memory',-20,33))
  group(ctx,coreReveal*(1-userspace),()=>callout(project(83,72,31),'4 cores',64,15,C.yellow))
  group(ctx,userspace*(1-terminal),()=>callout(project(85,75,25),'kernel',65,26))

  // UART route is drawn before the console opens, making the last reveal causal.
  const port=project(188,-7,12),connector=[port,[port[0]+35,port[1]-25],[258,-110],[218,-138]]
  group(ctx,phase(T,19.6,21.3),()=>{
    block(175,-25,24,42,4,10,machineShade(.22),C.yellow)
    line(ctx,connector,machineShade(.35),1)
    machineTrace(ctx,connector,phase(T,19.9,21.7),1.4)
    if(T>22) machinePacket(ctx,connector,(t*.2)%1)
  })
  group(ctx,terminal,()=>{
    const panelWidth=440*terminal,x=-220,y=-286
    ctx.save();ctx.beginPath();ctx.rect(x,y,panelWidth,148);ctx.clip()
    rect(ctx,x,y,440,148,machineShade(.25,[20,21,26]),machineShade(.75))
    line(ctx,[[x,y+30],[220,y+30]],machineShade(.4))
    text(ctx,'uart0 rx / perspicua',x+17,y+16,10,C.pale)
    dot(ctx,200,y+15,3,C.yellow)
    group(ctx,phase(T,22,22.7),()=>text(ctx,'[ INIT ] Userspace started',x+17,y+54,12,C.pale))
    group(ctx,phase(T,22.5,23.2),()=>text(ctx,'[ INIT ] Forking shell...',x+17,y+78,12,C.pale))
    group(ctx,phase(T,23,23.7),()=>{
      text(ctx,'perspicua:/$',x+17,y+117,20,C.yellow)
      rect(ctx,0,y+107,10,21,C.yellow)
    })
    ctx.restore()
    group(ctx,phase(T,24,25),()=>text(ctx,'system online',0,284,11,C.pale,'center'))
  })
  ctx.restore()
  k=1
}

const DATA_BITS = Array.from({ length: 8 }, (_, i) => (0x65 >> i) & 1)
export const UART_FRAME = [0, ...DATA_BITS, 1]
function byteTile(ctx, x, y, size = 56, label = 'e', alpha = 1) {
  group(ctx,alpha,()=>{rect(ctx,x-size/2,y-size/2,size,size,C.yellow);text(ctx,label,x,y+1,size*.6,C.ink,'center',true)})
}
function byte(ctx, t) {
  const crossBoundary = phase(t,3.2,5.5), queue = phase(t,7,9.1), straighten = phase(t,10.5,12.6), voltage = phase(t,14.7,17.1), receive = phase(t,19,21.4)
  group(ctx,1-crossBoundary,()=>{
    text(ctx,'write(1, "e", 1);',0,-20,35,C.white,'center')
    const x=47
    line(ctx,[[x-11,7],[x+11,7]],C.yellow,3); text(ctx,'0x65',x,57,14,C.yellow,'center')
    line(ctx,[[x,19],[x,38]],C.yellow); text(ctx,'one byte. a long way to travel.',0,137,13,C.pale,'center')
    text(ctx,'C / userspace',0,-128,11,C.pale,'center')
  })
  group(ctx,crossBoundary*(1-queue),()=>{
    const top=[[-240,-153],[160,-153],[275,-85],[-125,-85]], bottom=top.map(([x,y])=>[x,y+254])
    polygon(ctx,top,'rgba(221,211,251,.08)','rgba(221,211,251,.6)');polygon(ctx,bottom,'rgba(221,211,251,.06)','rgba(221,211,251,.4)')
    for(let i=0;i<4;i++) line(ctx,[top[i],bottom[i]],'rgba(221,211,251,.15)')
    line(ctx,[[-270,18],[285,18]],'rgba(255,216,74,.65)',1)
    text(ctx,'userspace',-240,-180,12);text(ctx,'kernel',-240,204,12);text(ctx,'syscall boundary',102,38,10,C.yellow)
    const p=phase(t,4.7,7.2), y=mix(-121,135,p)
    line(ctx,[[20,-120],[20,135]],'rgba(255,216,74,.3)')
    byteTile(ctx,20,y,48);text(ctx,'0x65',61,y,11,C.yellow)
  })
  group(ctx,queue*(1-voltage),()=>{
    const ringAlpha=1-straighten
    group(ctx,ringAlpha,()=>{
      ctx.beginPath();ctx.arc(0,0,156,0,TAU);ctx.strokeStyle='rgba(221,211,251,.3)';ctx.lineWidth=1;ctx.stroke()
      for(let i=0;i<16;i++){
        const angle=i/16*TAU-Math.PI/2,p=[Math.cos(angle)*156,Math.sin(angle)*156]
        ctx.save();ctx.translate(...p);ctx.rotate(angle+Math.PI/2);rect(ctx,-18,-24,36,48,i<5?'rgba(221,211,251,.16)':C.bg,'rgba(221,211,251,.6)');ctx.restore()
      }
      const angle=mix(-Math.PI/2,Math.PI/2,phase(t,8.5,10.5)),p=[Math.cos(angle)*156,Math.sin(angle)*156]
      byteTile(ctx,...p,48);text(ctx,'transmit queue',0,-20,15,C.white,'center');text(ctx,'waiting → ready',0,9,11,C.pale,'center')
      ruleLabel(ctx,'tail',150,-160,30);ruleLabel(ctx,'head',150,160,30)
    })
    for(let i=0;i<8;i++){
      const angle=i/8*TAU-Math.PI/2,from=[Math.cos(angle)*156,Math.sin(angle)*156],to=[-210+i*60,0],p=vMix(from,to,straighten)
      group(ctx,straighten,()=>{rect(ctx,p[0]-24,p[1]-32,48,64,'rgba(255,216,74,.07)',C.yellow);text(ctx,String(DATA_BITS[i]),...p,30,C.yellow,'center');text(ctx,`b${i}`,p[0],p[1]+55,10,C.pale,'center')})
    }
    group(ctx,straighten,()=>{text(ctx,'0x65 / 01100101',0,-116,17,C.white,'center');text(ctx,'the least-significant bit goes first',0,120,12,C.pale,'center')})
  })
  const startX=-285, step=57, high=-38, low=53
  group(ctx,voltage*(1-receive),()=>{
    text(ctx,'UART TX',-285,-151,14,C.yellow);text(ctx,'8N1 / LSB first',285,-151,11,C.pale,'right')
    for(let i=0;i<10;i++){
      const x=startX+i*step
      line(ctx,[[x,-81],[x,106]],'rgba(221,211,251,.16)')
      text(ctx,String(UART_FRAME[i]),x+step/2,mix(0,-96,voltage),22,i===0||i===9?C.pale:C.yellow,'center')
      text(ctx,i===0?'start':i===9?'stop':`b${i-1}`,x+step/2,132,10,C.pale,'center')
    }
    const pts=[[startX-35,high],[startX,high]], reveal=clamp((t-16.3)/2.5)
    UART_FRAME.forEach((b,i)=>{const x=startX+i*step,y=b?high:low;pts.push([x,y],[x+step,y])});pts.push([startX+10*step+35,high])
    line(ctx,pts,'rgba(221,211,251,.3)',1)
    ctx.save();ctx.beginPath();ctx.rect(startX-40,-70,(step*10+80)*reveal,160);ctx.clip();line(ctx,pts,C.yellow,3);ctx.restore()
    const scan=startX-35+(step*10+70)*reveal
    if(reveal<1){line(ctx,[[scan,-67],[scan,103]],C.white);dot(ctx,scan,-67,3,C.white)}
    text(ctx,'idle high',startX-32,high-21,9,C.pale,'right');text(ctx,'voltage over time',0,198,12,C.pale,'center')
  })
  group(ctx,receive,()=>{
    const spread=1-phase(t,20.4,22.5)
    group(ctx,spread,()=>{
      for(let i=0;i<8;i++){
        const x=(-210+i*60)*spread,y=(DATA_BITS[i]?-65:65)*spread
        text(ctx,String(DATA_BITS[i]),x,y,24,C.yellow,'center');line(ctx,[[x,y+17],[0,0]],'rgba(255,216,74,.18)')
      }
    })
    group(ctx,1-spread,()=>{
      rect(ctx,-232,-170,464,340,'rgba(221,211,251,.04)','rgba(221,211,251,.5)')
      line(ctx,[[-232,-130],[232,-130]],'rgba(221,211,251,.4)');text(ctx,'terminal / rx',-210,-150,11)
      text(ctx,'e',-15,15,155,C.yellow,'center',true)
      rect(ctx,45,72,47,7,C.yellow)
      text(ctx,'0x65 → e',0,132,12,C.pale,'center')
    })
  })
}

const DRAW = { pixel, boot, byte }
// `frame` lets a host place the scene itself: { x, y } as fractions of the
// canvas, `size` as a multiple of the default scale, and `phoneY` for the
// stacked phone layout.
export function renderScene(ctx, scene, time, width, height, dpr = 1, frame = null) {
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;ctx.fillStyle=C.bg;ctx.fillRect(0,0,width,height)
  const mobile=width<=600, scale=mobile?Math.min(width*.96/720,height*.43/600):Math.min(width*.59/720,height*.87/640)
  // the machine fills more of the frame and runs off its right edge
  const big = scene === 'boot' && !mobile, s = scale * (frame?.size ?? (big ? 1.22 : 1))
  sceneScale = s
  ctx.save();ctx.translate(mobile?width*.5:width*(frame?.x??(big?.74:.715)),mobile?height*(frame?.phoneY??.735):height*(frame?.y??(big?.53:.49)));ctx.scale(s,s)
  DRAW[scene](ctx,SCENES[scene].ambient ? Math.max(0,time) : clamp(time,0,SCENES[scene].duration));ctx.restore()
  // While the camera is deep inside the chip the whole frame is detail. Veil
  // the text column until the board has come into view: nearly solid under
  // the name, thinning to nothing well before the transistor, so there is no
  // edge and the detail still shows faintly through.
  if (big) {
    const cover = 1 - clamp((time - 3.3) / 1.3)
    if (cover > 0) {
      const veil = ctx.createLinearGradient(0, 0, width * .56, 0)
      veil.addColorStop(0, 'rgba(90,53,213,.9)')
      veil.addColorStop(.5, 'rgba(90,53,213,.82)')
      veil.addColorStop(1, 'rgba(90,53,213,0)')
      ctx.globalAlpha = cover; ctx.fillStyle = veil; ctx.fillRect(0, 0, width * .56, height); ctx.globalAlpha = 1
    }
  }
}
