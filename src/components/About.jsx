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
          <div className="skills-section">
            <p className="small" style={{marginBottom: '8px'}}><strong>Skills:</strong></p>
            <div className="skills-tags">
              {['C', 'C++', 'C#', 'Python', 'MATLAB', 'Java', 'Javascript', 'Shell', 'CSS'].map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <p className="small" style={{marginTop: '12px'}}><strong>Interests:</strong> Music · Sports · Technology · Gaming</p>
        </div>
      </div>
    </section>
  )
}