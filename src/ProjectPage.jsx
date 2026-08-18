import { useEffect, useState } from 'react'
import './ProjectPage.css'

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
}

function ThemeIcon({ dark }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{dark ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></> : <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>}</svg>
}

function ProjectPage({ project, brand, dark, onToggleTheme, nextProject }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    document.title = `${project.name} — ${brand}`
    window.scrollTo(0, 0)
  }, [brand, project.name])

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const moveVisual = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--move-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`)
    event.currentTarget.style.setProperty('--move-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 12}px`)
  }

  const resetVisual = (event) => {
    event.currentTarget.style.setProperty('--move-x', '0px')
    event.currentTarget.style.setProperty('--move-y', '0px')
  }

  return (
    <main className="case-study">
      <div className="case-progress" style={{ transform: `scaleX(${progress})` }} />
      <header className="case-nav">
        <a className="case-logo" href="/">{brand}</a>
        <div><a className="case-back" href="/#work">← Back to projects</a><button className="case-theme" onClick={onToggleTheme} aria-label={`Use ${dark ? 'light' : 'dark'} theme`}><ThemeIcon dark={dark} /></button></div>
      </header>

      <article>
        <section className="case-hero">
          <div className="case-heading">
            <p>{project.id} / {project.discipline} / {project.year}</p>
            <h1>{project.name}</h1>
            <p className="case-summary">{project.summary}</p>
          </div>
          <div className={`case-visual ${project.tone}`} onPointerMove={moveVisual} onPointerLeave={resetVisual}>
            {project.image ? <img src={project.image} alt={project.imageAlt} /> : <span aria-hidden="true">{project.name.charAt(0)}</span>}
            <small>Move to explore</small>
          </div>
        </section>

        <section className="case-overview">
          <p className="case-label">Overview</p>
          <div>
            <p className="case-lead">{project.overview}</p>
            <ul>{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          </div>
        </section>

        <section className="case-process">
          <div><p className="case-label">The challenge</p><p>{project.challenge}</p></div>
          <div><p className="case-label">The solution</p><p>{project.solution}</p></div>
        </section>

        <section className="case-highlights">
          <p className="case-label">Key highlights</p>
          <ol>{project.highlights.map((highlight, index) => <li key={highlight}><span>{String(index + 1).padStart(2, '0')}</span>{highlight}</li>)}</ol>
        </section>

        {(project.liveUrl || project.githubUrl) && <section className="case-links">
          <p>Explore the project</p>
          <div>
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live website <ArrowIcon /></a>}
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub repository <ArrowIcon /></a>}
          </div>
        </section>}

        {nextProject && <a className="next-project" href={`/projects/${nextProject.slug}`}>
          <span>Next project / {nextProject.id}</span><strong>{nextProject.name}</strong><ArrowIcon />
        </a>}

        <footer className="case-footer"><span>© 2026 {brand}</span><a href="/#work">All projects →</a></footer>
      </article>
    </main>
  )
}

export default ProjectPage
