import { useEffect, useRef, useState } from 'react'
import { sounds } from '../utils/audio'

const TARGET_TEXT = 'generative AI projects.'
const CHARS = '!<>-_/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz0123456789'

export default function ScrambleHeadlineText() {
  const [displayText, setDisplayText] = useState(TARGET_TEXT)
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef(null)
  const frameCountRef = useRef(0)

  useEffect(() => {
    if (isHovered) {
      // High-speed 60fps hacker scramble loop
      const runScramble = () => {
        const textArr = TARGET_TEXT.split('')
        const scrambled = textArr
          .map((char) => {
            if (char === ' ') return ' '
            return Math.random() < 0.75
              ? CHARS[Math.floor(Math.random() * CHARS.length)]
              : char
          })
          .join('')

        setDisplayText(scrambled)

        // Rapid crisp typewriter typing clicks
        frameCountRef.current++
        if (sounds.enabled && frameCountRef.current % 2 === 0) {
          sounds.play('typeClick')
        }

        rafRef.current = requestAnimationFrame(runScramble)
      }

      rafRef.current = requestAnimationFrame(runScramble)
    } else {
      // Instantly cancel frame and lock back to static clean text
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      setDisplayText(TARGET_TEXT)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isHovered])

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="inline-block cursor-pointer font-mono text-gray-950 underline decoration-gray-300 underline-offset-8 transition-colors select-none hover:decoration-gray-900 dark:text-white dark:decoration-gray-700 dark:hover:decoration-white"
      title="Hover over me!"
    >
      {displayText}
    </span>
  )
}
