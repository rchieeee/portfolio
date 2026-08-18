// ============================================================
// TEXT SCRAMBLE / DECRYPT EFFECT
// Bulletproof Hover Scramble Controller with Synchronized Typing Sound
// ============================================================

import { sounds } from './audio'

export class TextScramble {
  constructor(el, enableSound = true) {
    this.el = el
    this.enableSound = enableSound
    this.chars = '!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz'
    this.rafId = null
    this.isHovering = false
    this.targetText = 'generative AI projects.'
    this.soundCounter = 0
  }

  // Starts continuous scrambling only while cursor is active
  start(targetText = 'generative AI projects.') {
    this.targetText = targetText
    this.isHovering = true
    this.soundCounter = 0

    // Stop any existing animation loop
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    const charsArray = targetText.split('')
    const loop = () => {
      // Hard guard: If user is no longer hovering, stop completely
      if (!this.isHovering) {
        this.el.innerText = this.targetText
        return
      }

      let output = ''
      for (let i = 0; i < charsArray.length; i++) {
        const char = charsArray[i]
        if (char === ' ') {
          output += ' '
        } else if (Math.random() < 0.65) {
          const rand = this.chars[Math.floor(Math.random() * this.chars.length)]
          output += `<span class="opacity-40 font-mono pointer-events-none">${rand}</span>`
        } else {
          output += char
        }
      }

      this.el.innerHTML = output

      // Play mechanical typewriter clicks
      if (this.enableSound && sounds.enabled) {
        this.soundCounter++
        if (this.soundCounter % 3 === 0) {
          sounds.play('typeClick')
        }
      }

      if (this.isHovering) {
        this.rafId = requestAnimationFrame(loop)
      }
    }

    this.rafId = requestAnimationFrame(loop)
  }

  // Instantly halts scrambling and resets text cleanly
  stop(targetText = 'generative AI projects.') {
    this.isHovering = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.el) {
      this.el.innerText = targetText || this.targetText
    }
  }

  // Initial mount one-shot decrypt
  setText(newText) {
    this.targetText = newText
    this.isHovering = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const queue = []

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 15)
      const end = start + Math.floor(Math.random() * 20 + 15)
      queue.push({ from, to, start, end, char: '' })
    }

    let frame = 0
    const update = () => {
      // If user started hovering, abort the initial animation
      if (this.isHovering) return

      let output = ''
      let complete = 0

      for (let i = 0; i < queue.length; i++) {
        let item = queue[i]
        if (frame >= item.end) {
          complete++
          output += item.to
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.35) {
            item.char = this.chars[Math.floor(Math.random() * this.chars.length)]
          }
          output += `<span class="opacity-40 font-mono pointer-events-none">${item.char}</span>`
        } else {
          output += item.from
        }
      }

      this.el.innerHTML = output

      if (complete === queue.length) {
        this.el.innerText = newText
      } else if (!this.isHovering) {
        frame++
        this.rafId = requestAnimationFrame(update)
      }
    }

    this.rafId = requestAnimationFrame(update)
  }
}
