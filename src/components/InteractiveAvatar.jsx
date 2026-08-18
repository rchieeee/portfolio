import { useRef, useState } from 'react'
import { profile } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function InteractiveAvatar() {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isBouncing, setIsBouncing] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)

  // Naturally Varied Bisdak AI Token Expressions (Varied Placement, No Emojis)
  const greetings = [
    "Hapit na gyud mahurot akong yawa nga token",
    "Peste, 429 na sad ang rate limit",
    "Gamay na lang token nahabilin sa context atay",
    "Mahalag credits sa OpenAI oy, pisting yawa gyud",
    "Dali-a ra mahurot sa token oy, giatay na",
    "Wa pa gani nahuman ang code, pesteha nahurot na ang quota",
    "Nag-hallucinate na sad ning yawa nga model",
    "Ataya oy, na-zero na pud akong API key",
    "Sige pa mog generate diha, pisting yawa ma-max out na ta",
    "Kape na lang gyud intawon nahabilin ani yawa",
    "Paspasa mahurot sa giatay nga credits oy",
    "Gamay na lang gyud kaayong token nahabilin, peste",
  ]

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setTransform(`perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    sounds.play('tick')
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransform('')
  }

  const handleClick = () => {
    sounds.play('chime')
    setIsBouncing(true)
    setQuoteIndex((prev) => (prev + 1) % greetings.length)
    setTimeout(() => setIsBouncing(false), 500)
  }

  return (
    <div className="relative inline-block">
      {/* ── Interactive Floating Bisdak Speech Bubble ── */}
      <div
        className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-gray-200 bg-white/95 px-3 py-1 font-mono text-[11px] font-semibold text-gray-900 shadow-lg backdrop-blur-md transition-all duration-200 dark:border-gray-700 dark:bg-[#18181f]/95 dark:text-white ${
          isHovered || isBouncing
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-90'
        }`}
      >
        <span>{greetings[quoteIndex]}</span>
        {/* Little Arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-[#18181f]" />
      </div>

      {/* ── 3D Interactive Portrait Card ── */}
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
        }}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-md transition-all duration-200 dark:border-gray-700 dark:bg-[#121318] ${
          isBouncing ? 'animate-bounce' : ''
        }`}
        title="I-click ko bai!"
      >
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-20 w-20 sm:h-24 sm:w-24 object-cover object-top transition-transform duration-300 group-hover:scale-108"
        />

        {/* Glossy Sheen Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}
