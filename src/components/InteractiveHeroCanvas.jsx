import { useEffect, useRef, useState } from 'react'
import { sounds } from '../utils/audio'

export default function InteractiveHeroCanvas({ theme }) {
  const canvasRef = useRef(null)
  const [physicsMode, setPhysicsMode] = useState('attract') // 'attract' | 'repel' | 'vortex'

  const modeRef = useRef(physicsMode)
  useEffect(() => {
    modeRef.current = physicsMode
  }, [physicsMode])

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

    const particleColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 15, 20, 0.35)'
    const lineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 15, 20, 0.06)'
    const highlightLineColor = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(15, 15, 20, 0.20)'
    const shockwaveColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(15, 15, 20, 0.18)'

    const numParticles = Math.min(Math.floor((width * height) / 24000), 50)
    const particles = []
    const shockwaves = []

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 190,
      isDown: false,
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.3 + 0.15),
        radius: Math.random() * 1.5 + 1.2,
        originRadius: Math.random() * 1.5 + 1.2,
        parallaxSpeed: 0.3 + Math.random() * 0.45,
      })
    }

    const addShockwave = (x, y) => {
      shockwaves.push({
        x,
        y,
        radius: 5,
        maxRadius: Math.min(width, height) * 0.35,
        opacity: 0.8,
        speed: 8,
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
      mouse.isDown = false
    }

    const handleMouseDown = (e) => {
      mouse.isDown = true
      addShockwave(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      mouse.isDown = false
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const currentScrollY = window.scrollY || 0
      const scrollDelta = currentScrollY - lastScrollY
      lastScrollY = currentScrollY

      const currentMode = modeRef.current

      // Update and draw expanding shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s]
        sw.radius += sw.speed
        sw.opacity *= 0.95

        ctx.beginPath()
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2)
        ctx.strokeStyle = shockwaveColor.replace(/[\d.]+\)$/, `${sw.opacity * 0.3})`)
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Push particles along shockwave crest
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const dx = p.x - sw.x
          const dy = p.y - sw.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (Math.abs(dist - sw.radius) < 30) {
            const push = (1 - Math.abs(dist - sw.radius) / 30) * 4
            p.x += (dx / (dist || 1)) * push
            p.y += (dy / (dist || 1)) * push
          }
        }

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1)
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy - scrollDelta * p.parallaxSpeed

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height + (p.y % height)
        if (p.y > height) p.y = p.y % height

        // Interactive Magnetic Physics Modes
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius
          const power = mouse.isDown ? 4.0 : 2.0

          if (currentMode === 'attract') {
            // Magnetic pull toward cursor
            p.x += (dx / dist) * force * power
            p.y += (dy / dist) * force * power
            p.radius = p.originRadius * (1 + force * 1.1)
          } else if (currentMode === 'repel') {
            // Magnetic repulsion away from cursor
            p.x -= (dx / dist) * force * power * 1.5
            p.y -= (dy / dist) * force * power * 1.5
            p.radius = p.originRadius * (1 + force * 0.7)
          } else if (currentMode === 'vortex') {
            // Orbital swirl around cursor
            const angle = Math.atan2(dy, dx) + (Math.PI / 2) * 0.8
            p.x += Math.cos(angle) * force * power * 2.2 + (dx / dist) * force * 0.8
            p.y += Math.sin(angle) * force * power * 2.2 + (dy / dist) * force * 0.8
            p.radius = p.originRadius * (1 + force * 1.3)
          }
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

          if (distance < 135) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)

            const isNearMouse =
              Math.hypot(mouse.x - p.x, mouse.y - p.y) < mouse.radius ||
              Math.hypot(mouse.x - p2.x, mouse.y - p2.y) < mouse.radius

            ctx.strokeStyle = isNearMouse ? highlightLineColor : lineColor
            ctx.lineWidth = isNearMouse ? 1.2 : 0.6
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
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [theme])

  const modes = [
    { id: 'attract', label: '🧲 Attract' },
    { id: 'repel', label: '🛡️ Repel' },
    { id: 'vortex', label: '🌀 Vortex' },
  ]

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-85 transition-opacity duration-300"
      />

      {/* ── Unobtrusive Minimalist Floating Physics Widget ── */}
      <div className="fixed bottom-4 left-4 z-30 hidden sm:flex items-center gap-1 rounded-full border border-gray-200/90 bg-white/80 p-1 shadow-sm backdrop-blur-md dark:border-gray-800/90 dark:bg-[#101116]/80 font-mono text-[11px] select-none">
        <span className="px-2 text-gray-400 dark:text-gray-500 font-semibold text-[10px] uppercase tracking-wider">
          Physics:
        </span>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              sounds.play('tick')
              setPhysicsMode(m.id)
            }}
            className={`rounded-full px-2.5 py-0.5 transition-all cursor-pointer ${
              physicsMode === m.id
                ? 'bg-gray-900 text-white font-bold dark:bg-white dark:text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
            }`}
            title={`Set Canvas Physics to ${m.label}`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </>
  )
}
