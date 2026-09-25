import { useRef, useState } from 'react'

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.08)',
  spotlightColorLight = 'rgba(0, 0, 0, 0.04)',
  tilt = true,
  ...props
}) {
  const cardRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setPosition({ x, y })
    setOpacity(1)

    // Only apply 3D tilt on devices with hover capabilities (mouse/trackpad)
    if (tilt && typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -4
      const rotateY = ((x - centerX) / centerX) * 4
      setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`)
    }
  }

  const handleMouseLeave = () => {
    setOpacity(0)
    setTransform('')
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform,
        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.2s ease',
      }}
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs dark:border-gray-800 dark:bg-[#121318] ${className}`}
      {...props}
    >
      {/* ── Dynamic Mouse Cursor Spotlight Overlay ── */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 dark:hidden"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColorLight}, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 hidden dark:block"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {children}
    </div>
  )
}
