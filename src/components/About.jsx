import React from 'react'

export default function About(){
  return (
    <section id="about" className="card" aria-labelledby="about-heading">
      <h2 id="about-heading">About 🙋</h2>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <img className="avatar" src="pfp2.jpg" alt="Profile picture of Eduard Bostina" />
        <div>
          <p>I'm a C++ developer who loves bringing ideas to life through clean and efficient code. I enjoy solving challenging problems and learning new ways to make my projects faster and smarter.</p>
          <p>When I'm not coding, you'll probably find me playing guitar, watching football, or hanging out with friends. I'm a people person at heart, always up for meeting new people, sharing ideas, and learning from others.</p>
          <p className="small"><strong>Skills:</strong> C · C++ · C# · Python · MATLAB · Java · Javascript · Shell · CSS</p>
          <p className="small"><strong>Interests:</strong> Music · Sports · Technology · Gaming</p>
        </div>
      </div>
    </section>
  )
}