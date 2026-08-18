// Web Audio API Synthesizer for tactile UI feedback
// Pure synthesized audio — no external audio files required

class SoundEngine {
  constructor() {
    this.ctx = null
    this.enabled = true
    this.unlocked = false

    try {
      const saved = localStorage.getItem('sound_enabled')
      if (saved !== null) {
        this.enabled = saved === 'true'
      }
    } catch {
      this.enabled = true
    }
  }

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (AudioCtx) {
      this.ctx = new AudioCtx()
      this.unlocked = true
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleSound() {
    this.ensureContext()
    this.enabled = !this.enabled
    try {
      localStorage.setItem('sound_enabled', String(this.enabled))
    } catch {}
    if (this.enabled) {
      this.play('toggle')
    }
    return this.enabled
  }

  play(type = 'tick') {
    if (!this.enabled) return
    this.ensureContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    switch (type) {
      case 'typeClick': {
        // High-end tactile mechanical typing click (increased volume & randomized crisp pitch)
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const freq = 1800 + Math.random() * 800
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now)
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.02)
        gain.gain.setValueAtTime(0.14, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.022)
        break
      }

      case 'tick': {
        // Crisp tactile click (boosted volume)
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const freq = 2400 + Math.random() * 400
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.018)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.02)
        break
      }

      case 'press': {
        // Deep solid keypress (boosted volume)
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.03)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.035)
        break
      }

      case 'release': {
        // Snappy key release (boosted volume)
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1100, now)
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.025)
        gain.gain.setValueAtTime(0.10, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.028)
        break
      }

      case 'toggle': {
        // Two-tone switch (boosted volume)
        ;[700, 1100].forEach((freq, i) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.035)
          gain.gain.setValueAtTime(0.12, now + i * 0.035)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.05)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.035)
          osc.stop(now + i * 0.035 + 0.055)
        })
        break
      }

      case 'droplet': {
        // Water droplet tone (boosted volume)
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1500, now)
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12)
        gain.gain.setValueAtTime(0.14, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.14)
        break
      }

      case 'chime': {
        // Ascending harmonic chime (boosted volume)
        ;[1046.5, 1318.5, 1567.98].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.06)
          gain.gain.setValueAtTime(0.10, now + idx * 0.06)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.28)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + idx * 0.06)
          osc.stop(now + idx * 0.06 + 0.3)
        })
        break
      }

      case 'success': {
        // Joyful triad chord (boosted volume)
        ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.04)
          gain.gain.setValueAtTime(0.12, now + idx * 0.04)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + idx * 0.04)
          osc.stop(now + idx * 0.04 + 0.38)
        })
        break
      }

      default:
        break
    }
  }
}

export const sounds = new SoundEngine()
