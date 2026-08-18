import { useEffect, useRef } from 'react'

export default function InteractiveHeroCanvas({ theme }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let lastScrollY = window.scrollY || 0

    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    const particleColor = isDark ? 'rgba(255, 255, 255, 0.42)' : 'rgba(15, 15, 20, 0.32)'
    const lineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 15, 20, 0.06)'
    const highlightLineColor = isDark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(15, 15, 20, 0.18)'

    // Clean, reduced particle count (~40 particles on desktop)
    const numParticles = Math.min(Math.floor((width * height) / 28000), 42)
    const particles = []

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.3 + 0.15), // Gentle baseline upward ambient drift
        radius: Math.random() * 1.5 + 1.2,
        originRadius: Math.random() * 1.5 + 1.2,
        parallaxSpeed: 0.3 + Math.random() * 0.45, // Parallax response speed on scroll
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Calculate scroll delta for upward movement on scroll
      const currentScrollY = window.scrollY || 0
      const scrollDelta = currentScrollY - lastScrollY
      lastScrollY = currentScrollY

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        // Default upward drift + upward movement proportional to downward scroll
        p.y += p.vy - scrollDelta * p.parallaxSpeed

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height + (p.y % height)
        if (p.y > height) p.y = p.y % height

        // Magnetic attraction anywhere on the entire landing page
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius
          p.x += (dx / dist) * force * 2.0
          p.y += (dy / dist) * force * 2.0
          p.radius = p.originRadius * (1 + force * 0.9)
        } else {
          p.radius = p.originRadius
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Connect neighboring particles with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const distance = Math.hypot(p.x - p2.x, p.y - p2.y)

          if (distance < 130) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)

            const isNearMouse =
              Math.hypot(mouse.x - p.x, mouse.y - p.y) < mouse.radius ||
              Math.hypot(mouse.x - p2.x, mouse.y - p2.y) < mouse.radius

            ctx.strokeStyle = isNearMouse ? highlightLineColor : lineColor
            ctx.lineWidth = isNearMouse ? 1.1 : 0.6
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-80 transition-opacity duration-300"
    />
  )
}
