import { useEffect, useRef, useState } from 'react'
import { sounds } from '../utils/audio'

const LETTERS = [
  { char: 'a', dissolves: false, id: 'a' },
  { char: 'r', dissolves: true, id: 'r' },
  { char: 'c', dissolves: true, id: 'c' },
  { char: 'h', dissolves: true, id: 'h' },
  { char: 'i', dissolves: false, id: 'i' },
  { char: 'e', dissolves: true, id: 'e' },
]

export default function SplashIntro({ onGlideStart, onComplete }) {
  // 'initial' | 'sliding' | 'growing' | 'gliding' | 'done'
  const [stage, setStage] = useState('initial')
  const [slideDeltas, setSlideDeltas] = useState({ deltaA: 0, deltaI: 0 })
  const [glideStyle, setGlideStyle] = useState({})

  const containerRef = useRef(null)
  const aRef = useRef(null)
  const iRef = useRef(null)
  const aiUppercaseRef = useRef(null)
  const timersRef = useRef([])

  const onGlideStartRef = useRef(onGlideStart)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onGlideStartRef.current = onGlideStart
    onCompleteRef.current = onComplete
  }, [onGlideStart, onComplete])

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const handleSkip = () => {
    clearAllTimers()
    sounds.play('tick')
    onGlideStartRef.current?.()
    onCompleteRef.current?.()
  }

  // Keyboard shortcut: Escape to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        clearAllTimers()
        sounds.play('tick')
        onGlideStartRef.current?.()
        onCompleteRef.current?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll while splash screen is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  // Measure letter positions for 100% GPU-composited translation (zero layout reflow)
  const measureOffsets = () => {
    if (!containerRef.current || !aRef.current || !iRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const aRect = aRef.current.getBoundingClientRect()
    const iRect = iRef.current.getBoundingClientRect()

    const centerX = containerRect.left + containerRect.width / 2
    const combinedWidth = aRect.width + iRect.width

    const targetLeftA = centerX - combinedWidth / 2
    const targetLeftI = targetLeftA + aRect.width

    setSlideDeltas({
      deltaA: targetLeftA - aRect.left,
      deltaI: targetLeftI - iRect.left,
    })
  }

  useEffect(() => {
    measureOffsets()
    window.addEventListener('resize', measureOffsets)
    return () => window.removeEventListener('resize', measureOffsets)
  }, [])

  useEffect(() => {
    // 0ms: Initial presentation of "archie" in bold sans font
    sounds.play('tick')

    // t=770ms: Smoothly slide 'a' and 'i' together while 'rche' dissolves out
    const t1 = setTimeout(() => {
      setStage('sliding')
      sounds.play('typeClick')
    }, 770)

    // t=1350ms: Smoothly GROW 'ai' larger on screen until it reaches the uppercase size of 'AI'
    const t2 = setTimeout(() => {
      setStage('growing')
      sounds.play('chime')
    }, 1350)

    // t=2050ms: Glide 'AI' to target headline coordinate and reveal page
    const t3 = setTimeout(() => {
      const targetEl = document.getElementById('hero-ai-target')
      if (targetEl && aiUppercaseRef.current && containerRef.current) {
        const targetRect = targetEl.getBoundingClientRect()
        const sourceRect = aiUppercaseRef.current.getBoundingClientRect()

        const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)
        const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)
        const scale = Math.max(0.35, Math.min(1.0, targetRect.height / sourceRect.height))

        setGlideStyle({
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`,
          transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 700ms ease',
        })
      } else {
        // Fallback glide if target not in viewport
        setGlideStyle({
          transform: 'translate3d(0, 160px, 0) scale(0.6)',
          opacity: 0,
          transition: 'transform 720ms cubic-bezier(0.16, 1, 0.3, 1), opacity 660ms ease',
        })
      }

      setStage('gliding')
      onGlideStartRef.current?.()
    }, 2050)

    // t=2850ms: Complete and hand over to native headline
    const t4 = setTimeout(() => {
      setStage('done')
      onCompleteRef.current?.()
    }, 2850)

    timersRef.current = [t1, t2, t3, t4]
    return clearAllTimers
  }, [])

  if (stage === 'done') return null

  const isSliding = stage === 'sliding' || stage === 'growing' || stage === 'gliding'
  const isGrowing = stage === 'growing' || stage === 'gliding'
  const isGliding = stage === 'gliding'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none ${
        isGliding ? 'pointer-events-none' : ''
      }`}
    >
      {/* Background Masking Overlay (Strictly Plain Pure White Canvas) */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-700 ${
          isGliding ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Floating Animated Centerpiece (Single Bold Typeface matching Image 2) */}
      <div
        ref={containerRef}
        style={isGliding ? glideStyle : undefined}
        className={`relative z-10 flex items-center justify-center font-sans font-extrabold tracking-tight text-5xl sm:text-7xl transition-colors duration-700 select-none ${
          isGliding ? 'text-gray-950 dark:text-white' : 'text-gray-950'
        }`}
      >
        {/* Growth wrapper: physically scales up from 1.0 to 1.42 during stage 'growing' */}
        <div
          style={{
            transform: isGrowing && !isGliding ? 'scale(1.42)' : 'scale(1)',
            transition: isGliding ? 'none' : 'transform 650ms cubic-bezier(0.2, 0.9, 0.3, 1)',
            willChange: 'transform',
          }}
          className="relative flex items-center justify-center"
        >
          {/* Letters container */}
          <div className="flex items-center">
            {LETTERS.map((item) => {
              const isA = item.id === 'a'
              const isI = item.id === 'i'
              const isDissolving = item.dissolves

              let letterStyle = {}
              if (isDissolving) {
                letterStyle = {
                  opacity: isSliding ? 0 : 1,
                  transform: isSliding
                    ? 'translate3d(0, -8px, 0) scale(0.5)'
                    : 'translate3d(0, 0, 0) scale(1)',
                  transition: 'opacity 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, opacity',
                }
              } else if (isA) {
                letterStyle = {
                  transform: isSliding
                    ? `translate3d(${slideDeltas.deltaA}px, 0, 0)`
                    : 'translate3d(0, 0, 0)',
                  opacity: isGrowing ? 0 : 1,
                  transition: isGrowing
                    ? 'opacity 300ms ease 180ms'
                    : 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, opacity',
                }
              } else if (isI) {
                letterStyle = {
                  transform: isSliding
                    ? `translate3d(${slideDeltas.deltaI}px, 0, 0)`
                    : 'translate3d(0, 0, 0)',
                  opacity: isGrowing ? 0 : 1,
                  transition: isGrowing
                    ? 'opacity 300ms ease 180ms'
                    : 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, opacity',
                }
              }

              return (
                <span
                  key={item.id}
                  ref={isA ? aRef : isI ? iRef : undefined}
                  style={letterStyle}
                  className="inline-block"
                >
                  {item.char}
                </span>
              )
            })}
          </div>

          {/* Uppercase "AI" that emerges in place as the growth hits peak scale */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              ref={aiUppercaseRef}
              style={{
                opacity: isGrowing ? 1 : 0,
                transition: 'opacity 320ms ease 180ms',
                willChange: 'opacity',
              }}
              className={`inline-block font-sans font-extrabold tracking-tight transition-colors duration-700 ${
                isGliding ? 'text-gray-950 dark:text-white' : 'text-gray-950'
              } ${
                isGrowing
                  ? isGliding
                    ? 'drop-shadow-[0_0_18px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_0_24px_rgba(255,255,255,0.7)]'
                    : 'drop-shadow-[0_0_22px_rgba(0,0,0,0.18)]'
                  : ''
              }`}
            >
              AI
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Skip Pill for Instant Access */}
      {!isGliding && (
        <button
          type="button"
          onClick={handleSkip}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-3 py-1 font-mono text-[11px] text-gray-500 shadow-xs backdrop-blur-md hover:border-gray-400 hover:text-gray-950 cursor-pointer transition-all active:scale-95"
          title="Skip intro animation (Esc)"
        >
          <span>Skip</span>
          <kbd className="rounded bg-gray-100 px-1 py-0.5 text-[9px] text-gray-600 border border-gray-200">Esc</kbd>
        </button>
      )}
    </div>
  )
}
