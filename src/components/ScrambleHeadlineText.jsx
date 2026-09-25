import { useEffect, useRef, useState } from 'react'
import { sounds } from '../utils/audio'

const TARGET_TEXT = 'generative AI projects.'
const CHARS = '!<>-_/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz0123456789'

export default function ScrambleHeadlineText({ isIntroGliding = false, isIntroDone = true }) {
  const [displayText, setDisplayText] = useState(TARGET_TEXT)
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef(null)
  const frameCountRef = useRef(0)

  useEffect(() => {
    if (isHovered && isIntroDone) {
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
  }, [isHovered, isIntroDone])

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="inline-block cursor-pointer font-sans font-extrabold tracking-tight text-gray-950 decoration-gray-300 transition-colors select-none hover:decoration-gray-900 dark:text-white dark:decoration-gray-700 dark:hover:decoration-white"
      title="Hover over me!"
    >
      {!isIntroDone ? (
        <span className="inline-flex items-baseline">
          <span
            className={`transition-all duration-700 ease-out ${
              isIntroGliding ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
            }`}
          >
            generative&nbsp;
          </span>
          <span
            id="hero-ai-target"
            className="inline-block font-extrabold opacity-0"
          >
            AI
          </span>
          <span
            className={`transition-all duration-700 ease-out ${
              isIntroGliding ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
            }`}
          >
            &nbsp;projects.
          </span>
        </span>
      ) : (
        displayText
      )}
    </span>
  )
}
