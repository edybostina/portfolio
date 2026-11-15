import './animation-lab.css'
import { LINKS, PATCHES_UPSTREAM } from '../data/site.js'
import { SCENES, renderScene } from './scenes.js'

const $ = selector => document.querySelector(selector)
const canvas = $('#scene'), ctx = canvas.getContext('2d', { alpha: false })
const preview = $('.preview'), timeline = $('#timeline'), playButton = $('#play')
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
let scene = 'pixel', time = 0, idleTime = 0, playing = !reduced.matches, visible = true, last = 0, frame = 0, width = 0, height = 0, currentChapter = -1
const format = t => `00:${String(Math.floor(t)).padStart(2, '0')}`
$('#patches').textContent = PATCHES_UPSTREAM
$('#cv-link').href = LINKS.cv
$('#email-link').href = LINKS.email

function update() {
  const data = SCENES[scene]
  timeline.value = time
  $('#time').textContent = `${format(time)} / ${format(data.duration)}`
  timeline.setAttribute('aria-valuetext', `${time.toFixed(1)} seconds of ${data.duration}`)
  const index = data.chapters.findLastIndex(chapter => time >= chapter.t)
  if (index !== currentChapter) {
    currentChapter = index
    $('#scene-caption').textContent = data.chapters[index].caption
    $('#scene-count').textContent = `${String(index+1).padStart(2,'0')} / ${String(data.chapters.length).padStart(2,'0')}`
    document.querySelectorAll('.chapter').forEach((button,i) => {
      button.classList.toggle('active',i === index)
      button.setAttribute('aria-pressed', String(i === index))
    })
  }
}
function draw() { if (ctx && width && height) renderScene(ctx,scene,time+idleTime,width,height,Math.min(window.devicePixelRatio || 1,2)); update() }
function tick(now) {
  frame = 0
  if (!playing || !visible || document.hidden) { last = 0; return }
  if (last) {
    const delta = Math.min((now-last)/1000,.08)*Number($('#speed').value)
    if (time >= SCENES[scene].duration && SCENES[scene].ambient) idleTime += delta
    else time = Math.min(SCENES[scene].duration,time + delta)
  }
  last = now
  draw()
  if (time >= SCENES[scene].duration && !SCENES[scene].ambient) setPlaying(false)
  else frame = requestAnimationFrame(tick)
}
function schedule() { if (playing && visible && !document.hidden && !frame) { last = 0; frame = requestAnimationFrame(tick) } }
function setPlaying(value) {
  playing = value
  playButton.classList.toggle('paused',!value)
  playButton.setAttribute('aria-label',value?'Pause animation':'Play animation')
  playButton.querySelector('span').textContent = value?'pause':'play'
  if (!value) { cancelAnimationFrame(frame); frame = 0; last = 0 } else schedule()
}
function choose(key) {
  scene = Object.hasOwn(SCENES,key) ? key : 'pixel'; time = 0; idleTime = 0; currentChapter = -1
  const data = SCENES[scene]
  if (data.ambient && reduced.matches) time = data.chapters.at(-1).preview
  document.querySelectorAll('.concept').forEach(button => { const active=button.dataset.scene===scene; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)) })
  $('#note-title').textContent = data.title; $('#note-copy').textContent = data.description
  timeline.max = data.duration
  const chapters = $('#chapters'); chapters.replaceChildren(); chapters.style.setProperty('--chapters',data.chapters.length)
  for (const chapter of data.chapters) {
    const button = document.createElement('button'); button.type='button'; button.className='chapter'
    const stamp = document.createElement('span'); stamp.textContent=format(chapter.t)
    button.append(stamp,document.createTextNode(chapter.name))
    button.setAttribute('aria-label',`Preview ${chapter.name}`)
    button.addEventListener('click',()=>{time=chapter.preview;idleTime=0;setPlaying(false);draw()})
    chapters.append(button)
  }
  history.replaceState(null,'',`#${scene}`)
  setPlaying(!reduced.matches); motionPreference(); draw()
}
document.querySelectorAll('.concept').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.scene)))
window.addEventListener('hashchange',()=>choose(location.hash.slice(1)))
playButton.addEventListener('click',()=>{if(!playing && time>=SCENES[scene].duration && !SCENES[scene].ambient)time=0;setPlaying(!playing);draw()})
$('#replay').addEventListener('click',()=>{time=0;idleTime=0;setPlaying(true);draw()})
timeline.addEventListener('input',()=>{time=Number(timeline.value);idleTime=0;setPlaying(false);draw()})
$('#copy-toggle').addEventListener('click',()=>{
  const hidden=preview.classList.toggle('text-hidden'), button=$('#copy-toggle')
  button.setAttribute('aria-pressed',String(hidden));button.firstChild.textContent=hidden?'show text ':'hide text '
})
function motionPreference() {
  $('#motion-hint').textContent=reduced.matches?'Reduced motion is on. Choose a chapter, or press play to preview.':SCENES[scene].ambient?'Boots once, then quietly runs. Pause, scrub, or replay at any point.':'Plays once. Scrub the timeline to explore the transitions.'
  if(reduced.matches)setPlaying(false)
}
reduced.addEventListener('change',motionPreference)
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0}else schedule()})
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;last=0}},{threshold:0}).observe(preview)
new ResizeObserver(()=>{
  const box=preview.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2)
  width=box.width;height=box.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw()
}).observe(preview)
choose(location.hash.slice(1));motionPreference()
