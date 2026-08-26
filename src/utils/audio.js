// Web Audio API Synthesizer for tactile UI feedback
// Pure synthesized audio — zero external .mp3 files required

export const SOUND_PROFILES = [
  { id: 'mechanical', name: 'Mechanical', desc: 'Tactile mechanical keyboard switches' },
  { id: 'haptic', name: 'Haptic', desc: 'Minimal clean haptic clicks' },
  { id: 'chiptune', name: '8-Bit', desc: 'Arcade chiptune square-wave blips' },
]

class SoundEngine {
  constructor() {
    this.ctx = null
    this.enabled = true
    this.unlocked = false
    this.profile = 'mechanical' // Default: mechanical thock

    try {
      const savedEnabled = localStorage.getItem('sound_enabled')
      if (savedEnabled !== null) {
        this.enabled = savedEnabled === 'true'
      }
      const savedProfile = localStorage.getItem('sound_profile')
      if (savedProfile && SOUND_PROFILES.some((p) => p.id === savedProfile)) {
        this.profile = savedProfile
      }
    } catch {
      this.enabled = true
      this.profile = 'mechanical'
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

  setProfile(profileId) {
    if (!SOUND_PROFILES.some((p) => p.id === profileId)) return
    this.profile = profileId
    try {
      localStorage.setItem('sound_profile', profileId)
    } catch {}
    this.play('toggle')
    return this.profile
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

    // ─────────────────────────────────────────────
    // 1. MECHANICAL KEYBOARD PROFILE (Thocky Switches)
    // ─────────────────────────────────────────────
    if (this.profile === 'mechanical') {
      switch (type) {
        case 'typeClick':
        case 'tick': {
          // Dual transient click: crisp tactile bottom-out (3.2kHz) + resonant housing thock (280Hz)
          const oscTop = this.ctx.createOscillator()
          const gainTop = this.ctx.createGain()
          oscTop.type = 'triangle'
          oscTop.frequency.setValueAtTime(2800 + Math.random() * 600, now)
          oscTop.frequency.exponentialRampToValueAtTime(600, now + 0.015)
          gainTop.gain.setValueAtTime(0.12, now)
          gainTop.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)
          oscTop.connect(gainTop)
          gainTop.connect(this.ctx.destination)
          oscTop.start(now)
          oscTop.stop(now + 0.016)

          // Body resonance (thock)
          const oscBody = this.ctx.createOscillator()
          const gainBody = this.ctx.createGain()
          oscBody.type = 'sine'
          oscBody.frequency.setValueAtTime(260 + Math.random() * 40, now)
          oscBody.frequency.exponentialRampToValueAtTime(90, now + 0.035)
          gainBody.gain.setValueAtTime(0.15, now)
          gainBody.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)
          oscBody.connect(gainBody)
          gainBody.connect(this.ctx.destination)
          oscBody.start(now)
          oscBody.stop(now + 0.038)
          break
        }

        case 'press': {
          // Deep tactile spacebar/enter bottom-out
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(180, now)
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.04)
          gain.gain.setValueAtTime(0.18, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now)
          osc.stop(now + 0.045)
          break
        }

        case 'toggle': {
          // Double switch latch
          ;[400, 220].forEach((freq, i) => {
            const osc = this.ctx.createOscillator()
            const gain = this.ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(freq, now + i * 0.035)
            gain.gain.setValueAtTime(0.13, now + i * 0.035)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.03)
            osc.connect(gain)
            gain.connect(this.ctx.destination)
            osc.start(now + i * 0.035)
            osc.stop(now + i * 0.035 + 0.035)
          })
          break
        }

        case 'success': {
          ;[440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator()
            const gain = this.ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(freq, now + idx * 0.045)
            gain.gain.setValueAtTime(0.12, now + idx * 0.045)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.3)
            osc.connect(gain)
            gain.connect(this.ctx.destination)
            osc.start(now + idx * 0.045)
            osc.stop(now + idx * 0.045 + 0.32)
          })
          break
        }

        default:
          this.playHaptic(type, now)
          break
      }
      return
    }

    // ─────────────────────────────────────────────
    // 2. 8-BIT RETRO CHIPTUNE PROFILE
    // ─────────────────────────────────────────────
    if (this.profile === 'chiptune') {
      switch (type) {
        case 'typeClick':
        case 'tick': {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'square'
          const f = 640 + Math.floor(Math.random() * 4) * 120
          osc.frequency.setValueAtTime(f, now)
          osc.frequency.setValueAtTime(f * 1.5, now + 0.012)
          gain.gain.setValueAtTime(0.08, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now)
          osc.stop(now + 0.028)
          break
        }

        case 'press': {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'square'
          osc.frequency.setValueAtTime(320, now)
          osc.frequency.setValueAtTime(160, now + 0.02)
          gain.gain.setValueAtTime(0.1, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now)
          osc.stop(now + 0.045)
          break
        }

        case 'toggle': {
          ;[440, 880].forEach((freq, i) => {
            const osc = this.ctx.createOscillator()
            const gain = this.ctx.createGain()
            osc.type = 'square'
            osc.frequency.setValueAtTime(freq, now + i * 0.04)
            gain.gain.setValueAtTime(0.08, now + i * 0.04)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.04)
            osc.connect(gain)
            gain.connect(this.ctx.destination)
            osc.start(now + i * 0.04)
            osc.stop(now + i * 0.04 + 0.045)
          })
          break
        }

        case 'success': {
          ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator()
            const gain = this.ctx.createGain()
            osc.type = 'square'
            osc.frequency.setValueAtTime(freq, now + idx * 0.06)
            gain.gain.setValueAtTime(0.09, now + idx * 0.06)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.15)
            osc.connect(gain)
            gain.connect(this.ctx.destination)
            osc.start(now + idx * 0.06)
            osc.stop(now + idx * 0.06 + 0.16)
          })
          break
        }

        default:
          this.playHaptic(type, now)
          break
      }
      return
    }

    // ─────────────────────────────────────────────
    // 3. APPLE HAPTIC / MINIMAL PROFILE (Default Fallback)
    // ─────────────────────────────────────────────
    this.playHaptic(type, now)
  }

  playHaptic(type, now) {
    switch (type) {
      case 'typeClick':
      case 'tick': {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const freq = 1900 + Math.random() * 400
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.015)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.018)
        break
      }

      case 'press': {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.03)
        gain.gain.setValueAtTime(0.14, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.035)
        break
      }

      case 'toggle': {
        ;[800, 1200].forEach((freq, i) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.035)
          gain.gain.setValueAtTime(0.12, now + i * 0.035)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.04)
          osc.connect(gain)
          gain.connect(this.ctx.destination)
          osc.start(now + i * 0.035)
          osc.stop(now + i * 0.035 + 0.045)
        })
        break
      }

      case 'success': {
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
