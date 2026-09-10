import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { sounds } from '../utils/audio'
import {
  getStoredPlayerName,
  savePlayerName,
  getStoredPlayerWins,
  incrementPlayerWins,
  getCombinedLeaderboard,
  fetchRemoteLeaderboard,
  syncWinToFirebase,
} from '../utils/leaderboardService'

const WINNING_SCORE = 5
const TABLE_WIDTH = 440
const TABLE_HEIGHT = 620
const PADDLE_RADIUS = 25
const PUCK_RADIUS = 11.5
const GOAL_WIDTH = 156
const GOAL_LEFT = (TABLE_WIDTH - GOAL_WIDTH) / 2
const GOAL_RIGHT = GOAL_LEFT + GOAL_WIDTH

const DIFFICULTIES = [
  {
    id: 'casual',
    label: 'Casual',
    aiSpeed: 4.4,
    aiReaction: 0.82,
    strikePower: 1.05,
    tag: 'Warm-Up',
    desc: 'Relaxed speed and wide reaction window. Perfect for a quick warm-up.',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    aiSpeed: 6.4,
    aiReaction: 0.93,
    strikePower: 1.18,
    tag: 'Standard',
    desc: 'Tactical defense, smart rebounds & precision angle counter-strikes.',
  },
  {
    id: 'pro',
    label: 'Pro',
    aiSpeed: 8.6,
    aiReaction: 0.98,
    strikePower: 1.28,
    tag: 'Championship',
    desc: 'Fast tracking, bank-shots & aggressive pursuit. Hardcore challenge.',
  },
]

export default function CyberArcadeModal({
  isOpen,
  onClose,
  theme,
}) {
  const canvasRef = useRef(null)
  const nameInputRef = useRef(null)

  // Live dark/light mode detection with MutationObserver
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark') || theme === 'dark'
  })

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark') || theme === 'dark')
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
    return () => observer.disconnect()
  }, [theme])

  // Player and Leaderboard State
  const [playerName, setPlayerName] = useState(() => getStoredPlayerName())
  const [playerWins, setPlayerWins] = useState(() => getStoredPlayerWins())
  const [nameError, setNameError] = useState(false)

  const [difficulty, setDifficulty] = useState('balanced')
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [rallyCount, setRallyCount] = useState(0)
  // Game states: 'lobby' | 'playing' | 'scored' | 'gameover' | 'leaderboard'
  const [gameState, setGameState] = useState('lobby')
  const [winner, setWinner] = useState(null) // 'player' | 'ai'
  const [scoreBanner, setScoreBanner] = useState(null)
  const [remoteLeaderboard, setRemoteLeaderboard] = useState(null)

  const difficultyRef = useRef(difficulty)
  useEffect(() => {
    difficultyRef.current = difficulty
  }, [difficulty])

  const isDarkRef = useRef(isDark)
  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  const isNameValid = playerName.trim().length >= 2

  // Fetch live global leaderboard when modal opens or state changes
  useEffect(() => {
    if (isOpen) {
      fetchRemoteLeaderboard().then((data) => {
        if (data) setRemoteLeaderboard(data)
      })
    }
  }, [isOpen, gameState])

  // Reset to pre-game lobby whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setGameState('lobby')
      setWinner(null)
      setScoreBanner(null)
      setNameError(false)
      if (!getStoredPlayerName()) {
        setTimeout(() => nameInputRef.current?.focus(), 80)
      }
    }
  }, [isOpen])

  // Physics engine mutable state
  const sim = useRef({
    puck: { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT / 2, vx: 0, vy: 0, r: PUCK_RADIUS },
    player: {
      x: TABLE_WIDTH / 2,
      y: TABLE_HEIGHT - 75,
      vx: 0,
      vy: 0,
      r: PADDLE_RADIUS,
      targetX: TABLE_WIDTH / 2,
      targetY: TABLE_HEIGHT - 75,
    },
    ai: {
      x: TABLE_WIDTH / 2,
      y: 75,
      vx: 0,
      vy: 0,
      r: PADDLE_RADIUS,
      targetX: TABLE_WIDTH / 2,
      targetY: 75,
    },
    keys: { w: false, a: false, s: false, d: false, up: false, left: false, down: false, right: false },
    controlMode: 'mouse', // 'mouse' | 'touch' | 'keyboard'
    trail: [],
    particles: [],
    shakeAmount: 0,
    rally: 0,
    freezeTimer: 0,
    isOver: false,
  })

  // Start or restart match
  const startMatch = useCallback((newDiff = null) => {
    if (newDiff) {
      setDifficulty(newDiff)
      difficultyRef.current = newDiff
    }
    setPlayerScore(0)
    setAiScore(0)
    setRallyCount(0)
    setWinner(null)
    setScoreBanner(null)
    setGameState('playing')

    const s = sim.current
    s.isOver = false
    s.freezeTimer = 0
    s.rally = 0
    s.shakeAmount = 0
    s.trail = []
    s.particles = []
    s.puck.x = TABLE_WIDTH / 2
    s.puck.y = TABLE_HEIGHT / 2
    s.puck.vx = (Math.random() - 0.5) * 4
    s.puck.vy = Math.random() > 0.5 ? 4.5 : -4.5
    s.player.x = TABLE_WIDTH / 2
    s.player.y = TABLE_HEIGHT - 75
    s.player.targetX = TABLE_WIDTH / 2
    s.player.targetY = TABLE_HEIGHT - 75
    s.player.vx = 0
    s.player.vy = 0
    s.ai.x = TABLE_WIDTH / 2
    s.ai.y = 75
    s.ai.vx = 0
    s.ai.vy = 0

    sounds.play('chime')
  }, [])

  // Handle start button click with mandatory name validation
  const handleStartMatchClick = useCallback(() => {
    if (!playerName.trim() || playerName.trim().length < 2) {
      setNameError(true)
      sounds.play('droplet')
      nameInputRef.current?.focus()
      return
    }
    setNameError(false)
    startMatch()
  }, [playerName, startMatch])

  // Serve puck after a goal is scored
  const servePuck = useCallback((servedTo) => {
    const s = sim.current
    s.puck.x = TABLE_WIDTH / 2
    s.puck.y = TABLE_HEIGHT / 2
    s.puck.vx = (Math.random() - 0.5) * 3
    s.puck.vy = servedTo === 'player' ? 4.5 : -4.5
    s.player.targetX = TABLE_WIDTH / 2
    s.player.targetY = TABLE_HEIGHT - 75
    s.ai.x = TABLE_WIDTH / 2
    s.ai.y = 75
    s.ai.vx = 0
    s.ai.vy = 0
    s.rally = 0
    setRallyCount(0)
  }, [])

  // Spawn visual sparks
  const spawnSparks = (x, y, color = '#10b981', count = 16) => {
    const s = sim.current
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2.0 + Math.random() * 5.0
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.025 + Math.random() * 0.03,
        color,
        size: 2.2 + Math.random() * 2.8,
      })
    }
  }

  // Handle pointer tracking
  const updatePlayerPointer = (clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = TABLE_WIDTH / rect.width
    const scaleY = TABLE_HEIGHT / rect.height

    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY

    sim.current.controlMode = 'mouse'
    sim.current.player.targetX = Math.max(PADDLE_RADIUS, Math.min(TABLE_WIDTH - PADDLE_RADIUS, x))
    sim.current.player.targetY = Math.max(TABLE_HEIGHT / 2 + PADDLE_RADIUS + 6, Math.min(TABLE_HEIGHT - PADDLE_RADIUS, y))
  }

  // Record win against Archie AI in state, local storage, and Firebase
  const recordWin = useCallback(() => {
    const newWins = incrementPlayerWins()
    setPlayerWins(newWins)
    syncWinToFirebase(playerName, newWins, difficultyRef.current)
    fetchRemoteLeaderboard().then((data) => {
      if (data) setRemoteLeaderboard(data)
    })
  }, [playerName])

  // Handle player name edit
  const handleNameChange = (e) => {
    const val = e.target.value.slice(0, 18)
    setPlayerName(val)
    if (val.trim().length >= 2) {
      setNameError(false)
    }
    savePlayerName(val)
  }

  // Keyboard controls during match
  useEffect(() => {
    if (!isOpen || (gameState !== 'playing' && gameState !== 'scored')) return

    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase()
      const keys = sim.current.keys
      if (k === 'w' || k === 'arrowup') { keys.up = true; sim.current.controlMode = 'keyboard'; }
      if (k === 's' || k === 'arrowdown') { keys.down = true; sim.current.controlMode = 'keyboard'; }
      if (k === 'a' || k === 'arrowleft') { keys.left = true; sim.current.controlMode = 'keyboard'; }
      if (k === 'd' || k === 'arrowright') { keys.right = true; sim.current.controlMode = 'keyboard'; }
      if (k === 'r') {
        startMatch()
      }
    }

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase()
      const keys = sim.current.keys
      if (k === 'w' || k === 'arrowup') keys.up = false
      if (k === 's' || k === 'arrowdown') keys.down = false
      if (k === 'a' || k === 'arrowleft') keys.left = false
      if (k === 'd' || k === 'arrowright') keys.right = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isOpen, gameState, startMatch])

  // Canvas 60fps simulation loop with theme awareness
  useEffect(() => {
    if (!isOpen || (gameState !== 'playing' && gameState !== 'scored' && gameState !== 'gameover')) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let isMounted = true
    let animId = null

    const render = () => {
      if (!isMounted) return
      const s = sim.current
      const currentDark = isDarkRef.current

      // ── 1. Update Physics ──
      if (s.freezeTimer > 0) {
        s.freezeTimer -= 1
        if (s.freezeTimer === 0 && !s.isOver) {
          setScoreBanner(null)
          setGameState('playing')
        }
      } else if (!s.isOver) {
        // --- Player Movement ---
        if (s.controlMode === 'keyboard') {
          const speed = 7.8
          if (s.keys.left) s.player.x -= speed
          if (s.keys.right) s.player.x += speed
          if (s.keys.up) s.player.y -= speed
          if (s.keys.down) s.player.y += speed

          s.player.x = Math.max(PADDLE_RADIUS, Math.min(TABLE_WIDTH - PADDLE_RADIUS, s.player.x))
          s.player.y = Math.max(TABLE_HEIGHT / 2 + PADDLE_RADIUS + 6, Math.min(TABLE_HEIGHT - PADDLE_RADIUS, s.player.y))
          s.player.vx = (s.keys.right ? speed : 0) - (s.keys.left ? speed : 0)
          s.player.vy = (s.keys.down ? speed : 0) - (s.keys.up ? speed : 0)
        } else {
          // Smooth glide
          const prevX = s.player.x
          const prevY = s.player.y
          s.player.x += (s.player.targetX - s.player.x) * 0.46
          s.player.y += (s.player.targetY - s.player.y) * 0.46
          s.player.vx = s.player.x - prevX
          s.player.vy = s.player.y - prevY
        }

        // --- AI Movement ---
        const currentDiffConfig = DIFFICULTIES.find((d) => d.id === difficultyRef.current) || DIFFICULTIES[1]
        const aiSpeed = currentDiffConfig.aiSpeed
        let aiTargetX = TABLE_WIDTH / 2
        let aiTargetY = 85

        if (s.puck.y < TABLE_HEIGHT / 2 + 120) {
          aiTargetX = s.puck.x
          if (s.puck.y < TABLE_HEIGHT / 2 - 15) {
            aiTargetY = Math.min(TABLE_HEIGHT / 2 - PADDLE_RADIUS - 8, Math.max(45, s.puck.y - 25))
          } else {
            aiTargetY = 95
          }
        } else {
          aiTargetX = TABLE_WIDTH / 2 + (s.puck.x - TABLE_WIDTH / 2) * 0.35
          aiTargetY = 75
        }

        const prevAiX = s.ai.x
        const prevAiY = s.ai.y
        const dx = aiTargetX - s.ai.x
        const dy = aiTargetY - s.ai.y
        const dist = Math.hypot(dx, dy)

        if (dist > 1) {
          const step = Math.min(dist, aiSpeed)
          s.ai.x += (dx / dist) * step
          s.ai.y += (dy / dist) * step
        }

        s.ai.x = Math.max(PADDLE_RADIUS, Math.min(TABLE_WIDTH - PADDLE_RADIUS, s.ai.x))
        s.ai.y = Math.max(PADDLE_RADIUS + 4, Math.min(TABLE_HEIGHT / 2 - PADDLE_RADIUS - 6, s.ai.y))
        s.ai.vx = s.ai.x - prevAiX
        s.ai.vy = s.ai.y - prevAiY

        // --- Puck Movement & Friction ---
        s.puck.x += s.puck.vx
        s.puck.y += s.puck.vy
        s.puck.vx *= 0.995
        s.puck.vy *= 0.995

        // Trail recording
        s.trail.unshift({ x: s.puck.x, y: s.puck.y })
        if (s.trail.length > 9) s.trail.pop()

        // --- Wall Collisions ---
        if (s.puck.x - s.puck.r <= 0) {
          s.puck.x = s.puck.r
          s.puck.vx = -s.puck.vx * 0.96
          sounds.play('tick')
          spawnSparks(s.puck.x, s.puck.y, currentDark ? '#38bdf8' : '#0284c7', 6)
        }
        if (s.puck.x + s.puck.r >= TABLE_WIDTH) {
          s.puck.x = TABLE_WIDTH - s.puck.r
          s.puck.vx = -s.puck.vx * 0.96
          sounds.play('tick')
          spawnSparks(s.puck.x, s.puck.y, currentDark ? '#38bdf8' : '#0284c7', 6)
        }

        // Top wall (AI Goal zone)
        const isTopGoalX = s.puck.x >= GOAL_LEFT && s.puck.x <= GOAL_RIGHT
        if (s.puck.y - s.puck.r <= 0) {
          if (isTopGoalX) {
            // GOAL FOR PLAYER!
            sounds.play('chime')
            s.shakeAmount = 7
            spawnSparks(s.puck.x, 20, '#10b981', 36)
            setPlayerScore((prev) => {
              const next = prev + 1
              if (next >= WINNING_SCORE) {
                s.isOver = true
                setGameState('gameover')
                setWinner('player')
                recordWin()
              } else {
                setGameState('scored')
                setScoreBanner('GOAL! POINT FOR YOU!')
                s.freezeTimer = 65
                servePuck('ai')
              }
              return next
            })
          } else {
            s.puck.y = s.puck.r
            s.puck.vy = -s.puck.vy * 0.96
            sounds.play('tick')
            spawnSparks(s.puck.x, s.puck.y, currentDark ? '#38bdf8' : '#0284c7', 6)
          }
        }

        // Bottom wall (Player Goal zone)
        const isBottomGoalX = s.puck.x >= GOAL_LEFT && s.puck.x <= GOAL_RIGHT
        if (s.puck.y + s.puck.r >= TABLE_HEIGHT) {
          if (isBottomGoalX) {
            // GOAL FOR AI!
            sounds.play('droplet')
            s.shakeAmount = 7
            spawnSparks(s.puck.x, TABLE_HEIGHT - 20, '#f43f5e', 36)
            setAiScore((prev) => {
              const next = prev + 1
              if (next >= WINNING_SCORE) {
                s.isOver = true
                setGameState('gameover')
                setWinner('ai')
              } else {
                setGameState('scored')
                setScoreBanner('ARCHIE AI SCORED!')
                s.freezeTimer = 65
                servePuck('player')
              }
              return next
            })
          } else {
            s.puck.y = TABLE_HEIGHT - s.puck.r
            s.puck.vy = -s.puck.vy * 0.96
            sounds.play('tick')
            spawnSparks(s.puck.x, s.puck.y, currentDark ? '#38bdf8' : '#0284c7', 6)
          }
        }

        // --- Paddle Collisions ---
        const handlePaddleCollision = (paddle, isAI = false) => {
          const dx = s.puck.x - paddle.x
          const dy = s.puck.y - paddle.y
          const dist = Math.hypot(dx, dy)
          const minDist = s.puck.r + paddle.r

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist
            const ny = dy / dist

            s.puck.x = paddle.x + nx * minDist
            s.puck.y = paddle.y + ny * minDist

            const rvx = s.puck.vx - paddle.vx
            const rvy = s.puck.vy - paddle.vy
            const velAlongNormal = rvx * nx + rvy * ny

            if (velAlongNormal < 0) {
              const restitution = 1.16
              const impulse = -(1 + restitution) * velAlongNormal
              s.puck.vx += nx * impulse + paddle.vx * 0.4
              s.puck.vy += ny * impulse + paddle.vy * 0.4

              const speed = Math.hypot(s.puck.vx, s.puck.vy)
              const maxSpeed = 17.5
              if (speed > maxSpeed) {
                s.puck.vx = (s.puck.vx / speed) * maxSpeed
                s.puck.vy = (s.puck.vy / speed) * maxSpeed
              } else if (speed < 4.2) {
                s.puck.vx = (s.puck.vx / (speed || 1)) * 4.2
                s.puck.vy = (s.puck.vy / (speed || 1)) * 4.2
              }

              // Tactile impact shake on hard hits
              if (speed > 10) {
                s.shakeAmount = 4
              }

              s.rally += 1
              setRallyCount(s.rally)

              sounds.play('press')
              spawnSparks(s.puck.x, s.puck.y, isAI ? '#f43f5e' : '#10b981', 14)
            }
          }
        }

        handlePaddleCollision(s.player, false)
        handlePaddleCollision(s.ai, true)
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0) {
          s.particles.splice(i, 1)
        }
      }

      // ── 2. Render Canvas Frame ──
      ctx.save()

      // Handle screen shake
      if (s.shakeAmount > 0) {
        const sx = (Math.random() - 0.5) * s.shakeAmount
        const sy = (Math.random() - 0.5) * s.shakeAmount
        ctx.translate(sx, sy)
        s.shakeAmount *= 0.82
        if (s.shakeAmount < 0.3) s.shakeAmount = 0
      }

      ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT)

      // Table Surface Background
      if (currentDark) {
        const grad = ctx.createLinearGradient(0, 0, 0, TABLE_HEIGHT)
        grad.addColorStop(0, '#090a0f')
        grad.addColorStop(0.5, '#0e111a')
        grad.addColorStop(1, '#090a0f')
        ctx.fillStyle = grad
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, TABLE_HEIGHT)
        grad.addColorStop(0, '#f8fafc')
        grad.addColorStop(0.5, '#f1f5f9')
        grad.addColorStop(1, '#f8fafc')
        ctx.fillStyle = grad
      }
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT)

      // Subtle Grid Markings
      ctx.strokeStyle = currentDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.035)'
      ctx.lineWidth = 1
      for (let x = 32; x < TABLE_WIDTH; x += 32) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, TABLE_HEIGHT)
        ctx.stroke()
      }
      for (let y = 32; y < TABLE_HEIGHT; y += 32) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(TABLE_WIDTH, y)
        ctx.stroke()
      }

      // Center Divider Line
      ctx.strokeStyle = currentDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(5, 150, 105, 0.35)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 6])
      ctx.beginPath()
      ctx.moveTo(0, TABLE_HEIGHT / 2)
      ctx.lineTo(TABLE_WIDTH, TABLE_HEIGHT / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Center Face-Off Circle
      ctx.strokeStyle = currentDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(5, 150, 105, 0.3)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, TABLE_HEIGHT / 2, 54, 0, Math.PI * 2)
      ctx.stroke()

      // Center dot
      ctx.fillStyle = currentDark ? 'rgba(16, 185, 129, 0.5)' : 'rgba(5, 150, 105, 0.5)'
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, TABLE_HEIGHT / 2, 4.5, 0, Math.PI * 2)
      ctx.fill()

      // Goal Lines & Arcs
      // AI Goal (Top)
      ctx.strokeStyle = currentDark ? 'rgba(244, 63, 94, 0.45)' : 'rgba(225, 29, 72, 0.4)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, 0, 64, 0, Math.PI)
      ctx.stroke()
      ctx.fillStyle = currentDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(225, 29, 72, 0.08)'
      ctx.fillRect(GOAL_LEFT, 0, GOAL_WIDTH, 9)

      // Player Goal (Bottom)
      ctx.strokeStyle = currentDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(5, 150, 105, 0.4)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, TABLE_HEIGHT, 64, Math.PI, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = currentDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.08)'
      ctx.fillRect(GOAL_LEFT, TABLE_HEIGHT - 9, GOAL_WIDTH, 9)

      // Table Boundary Outer Border
      ctx.strokeStyle = currentDark ? '#1e293b' : '#cbd5e1'
      ctx.lineWidth = 3
      ctx.strokeRect(1.5, 1.5, TABLE_WIDTH - 3, TABLE_HEIGHT - 3)

      // Draw Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1.0

      // Draw Puck Motion Trail
      for (let i = 0; i < s.trail.length; i++) {
        const pt = s.trail[i]
        const opacity = (1 - i / s.trail.length) * 0.28
        ctx.fillStyle = currentDark
          ? `rgba(56, 189, 248, ${opacity})`
          : `rgba(2, 132, 199, ${opacity * 0.85})`
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, s.puck.r * (0.85 - i * 0.05), 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw Puck
      ctx.save()
      ctx.shadowColor = currentDark ? '#38bdf8' : 'rgba(0, 0, 0, 0.25)'
      ctx.shadowBlur = currentDark ? 10 : 5
      ctx.fillStyle = currentDark ? '#f8fafc' : '#0f172a'
      ctx.beginPath()
      ctx.arc(s.puck.x, s.puck.y, s.puck.r, 0, Math.PI * 2)
      ctx.fill()

      // Puck inner ring
      ctx.strokeStyle = currentDark ? '#0284c7' : '#38bdf8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(s.puck.x, s.puck.y, s.puck.r * 0.55, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // Draw AI Mallet (Crimson / Coral)
      ctx.save()
      ctx.shadowColor = currentDark ? '#f43f5e' : 'rgba(225, 29, 72, 0.4)'
      ctx.shadowBlur = currentDark ? 12 : 5
      ctx.fillStyle = currentDark ? '#f43f5e' : '#e11d48'
      ctx.beginPath()
      ctx.arc(s.ai.x, s.ai.y, s.ai.r, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = currentDark ? '#9f1239' : '#be123c'
      ctx.beginPath()
      ctx.arc(s.ai.x, s.ai.y, s.ai.r * 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fecdd3'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(s.ai.x, s.ai.y, s.ai.r * 0.3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // Draw Player Mallet (Emerald)
      ctx.save()
      ctx.shadowColor = currentDark ? '#10b981' : 'rgba(5, 150, 105, 0.4)'
      ctx.shadowBlur = currentDark ? 12 : 5
      ctx.fillStyle = currentDark ? '#10b981' : '#059669'
      ctx.beginPath()
      ctx.arc(s.player.x, s.player.y, s.player.r, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = currentDark ? '#065f46' : '#047857'
      ctx.beginPath()
      ctx.arc(s.player.x, s.player.y, s.player.r * 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#a7f3d0'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(s.player.x, s.player.y, s.player.r * 0.3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      isMounted = false
      if (animId) {
        cancelAnimationFrame(animId)
      }
    }
  }, [isOpen, gameState, recordWin, servePuck])

  // Compute live sorted leaderboard with zero dummy records
  const currentDiffLabel = DIFFICULTIES.find((d) => d.id === difficulty)?.label || 'Balanced'
  const sortedLeaderboard = useMemo(() => {
    return getCombinedLeaderboard(playerName, playerWins, currentDiffLabel, remoteLeaderboard)
  }, [playerName, playerWins, currentDiffLabel, remoteLeaderboard])

  const currentRank = sortedLeaderboard.findIndex((e) => e.isCurrent) + 1
  const prevRankPlayer = currentRank > 1 ? sortedLeaderboard[currentRank - 2] : null
  const winsToClimb = prevRankPlayer ? Math.max(1, prevRankPlayer.wins - playerWins + 1) : 0
  const topPlayer = sortedLeaderboard.length > 0 && sortedLeaderboard[0].wins > 0 ? sortedLeaderboard[0] : null

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 transition-colors"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Arcade Frame - Expanded modern console */}
      <div className="relative z-10 flex max-h-[94vh] w-full max-w-xl sm:max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-[#fafafa] shadow-2xl transition-colors dark:border-gray-800 dark:bg-[#0c0d12] text-gray-900 dark:text-gray-100 ring-1 ring-black/5 dark:ring-white/5">
        
        {/* ── Top Header Bar with 3 Header Controls on Top Right ── */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-2.5 sm:px-5 backdrop-blur-md transition-colors dark:border-gray-800/80 dark:bg-[#12141c]">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                  Cyber Air Hockey
                </h2>
                <span className="hidden sm:inline-block rounded bg-gray-100 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  2D Arena
                </span>
              </div>
            </div>
          </div>

          {/* Right: Leaderboard Toggle + Close Button */}
          <div className="flex items-center gap-2">
            {/* Leaderboard or Lobby View Toggle */}
            {gameState === 'leaderboard' ? (
              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('lobby')
                }}
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 font-mono text-[11px] text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
              >
                Lobby
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('leaderboard')
                }}
                className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                title="View Arena Leaderboard"
              >
                Board
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
              aria-label="Close Arcade"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── 1. PRE-GAME LOBBY SCREEN (Clean, Modern, Hook for Visitors) ── */}
        {gameState === 'lobby' && (
          <div className="flex flex-col p-5 sm:p-6 space-y-4 bg-[#fafafa] dark:bg-[#090a0f] min-h-[480px] justify-between overflow-y-auto">
            <div className="space-y-4">
              
              {/* Modern Minimalist Hero Card */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs transition-colors dark:border-gray-800 dark:bg-[#12141d]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Challenger Arena
                  </span>
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    Your Wins: <strong className="text-gray-950 dark:text-white">{playerWins}</strong>
                  </span>
                </div>
                <h3 className="mt-1.5 font-mono text-lg sm:text-xl font-bold tracking-tight text-gray-950 dark:text-white">
                  Can You Score 5 Goals on Archie AI?
                </h3>
                <p className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Direct physical 2D puck simulation. Enter your name, select your difficulty, and strike the puck past the AI net to climb the global leaderboard.
                </p>

                {/* Competitive Hook Banner */}
                <div className="mt-3.5 rounded-xl border border-gray-200 bg-gray-50/90 px-3.5 py-2 font-mono text-xs text-gray-700 dark:border-gray-800 dark:bg-[#171924] dark:text-gray-300">
                  {topPlayer ? (
                    <div className="flex items-center justify-between">
                      <span>Current #1: <strong className="text-gray-950 dark:text-white">{topPlayer.name}</strong> ({topPlayer.wins} wins)</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Beat AI to take the lead</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>Rank #1 is currently open!</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Be the first to claim it</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Player Name Input (Streamlined, frictionless) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Your Challenger Name / Nickname
                  </label>
                  {nameError ? (
                    <span className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      Enter at least 2 letters
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                      Required to track rank
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={playerName}
                    onChange={handleNameChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleStartMatchClick()
                      }
                    }}
                    maxLength={18}
                    placeholder="Type your name or handle..."
                    className={`w-full rounded-xl border px-3.5 py-2.5 font-mono text-xs transition-all focus:outline-none ${
                      nameError
                        ? 'border-rose-500 bg-rose-50/50 text-rose-950 dark:bg-rose-950/20 dark:text-white'
                        : isNameValid
                        ? 'border-gray-300 bg-white text-gray-900 focus:border-gray-950 dark:border-gray-700 dark:bg-[#141622] dark:text-white dark:focus:border-gray-400'
                        : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-900 dark:border-gray-700 dark:bg-[#141622] dark:text-white dark:placeholder-gray-500'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 font-mono text-[10px] text-gray-400">
                    {playerName.length}/18
                  </span>
                </div>
              </div>

              {/* Segmented Difficulty Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    AI Difficulty
                  </label>
                  <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
                    {DIFFICULTIES.find((d) => d.id === difficulty)?.tag} Mode
                  </span>
                </div>

                {/* Sleek segmented pill bar */}
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-[#12141e]">
                  {DIFFICULTIES.map((d) => {
                    const active = difficulty === d.id
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          sounds.play('tick')
                          setDifficulty(d.id)
                        }}
                        className={`rounded-lg py-2 font-mono text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-gray-950 shadow-xs dark:bg-gray-800 dark:text-white'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    )
                  })}
                </div>
                <p className="font-mono text-[11px] text-gray-500 dark:text-gray-400 px-1">
                  {DIFFICULTIES.find((d) => d.id === difficulty)?.desc}
                </p>
              </div>

              {/* Minimalist Controls Legend */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-3 py-2 font-mono text-[11px] text-gray-500 dark:border-gray-800/80 dark:bg-[#12141e] dark:text-gray-400">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Controls:</span>
                <span>Mouse Glide</span>
                <span>•</span>
                <span>Touch Drag</span>
                <span>•</span>
                <span>WASD Keys</span>
              </div>
            </div>

            {/* Action Buttons: Modern, Gentle on the Eyes */}
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={handleStartMatchClick}
                className={`w-full rounded-xl py-3 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isNameValid
                    ? 'bg-gray-950 text-white hover:bg-gray-800 active:scale-98 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 shadow-sm'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>▶</span>
                <span>
                  {isNameValid
                    ? `Start Match as ${playerName.trim()} vs Archie AI`
                    : 'Enter Your Name to Play'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('leaderboard')
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 font-mono text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#12141e] dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
              >
                View Worldwide Leaderboard
              </button>
            </div>
          </div>
        )}

        {/* ── 2. LEADERBOARD SCREEN ── */}
        {gameState === 'leaderboard' && (
          <div className="flex flex-col p-5 sm:p-6 space-y-4 bg-[#fafafa] dark:bg-[#090a0f] min-h-[480px] justify-between overflow-y-auto">
            <div className="space-y-3.5">
              {/* Leaderboard Header */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-gray-800 dark:bg-[#12141d]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Worldwide Leaderboard
                    </span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.2 font-mono text-[9px] font-bold text-emerald-700 border border-emerald-500/30 dark:text-emerald-400">
                      Live Firebase Sync
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Your Record: <strong className="text-gray-950 dark:text-white">{playerWins}</strong> Win{playerWins === 1 ? '' : 's'}
                  </span>
                </div>
                <h3 className="mt-1.5 font-mono text-lg font-bold text-gray-950 dark:text-white">
                  Wins Against Archie AI
                </h3>
                <p className="mt-0.5 font-mono text-xs text-gray-600 dark:text-gray-400">
                  Real visitor standings synchronized across all devices globally.
                </p>
              </div>

              {/* Competitive Rank Status Callout */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 font-mono text-xs text-gray-700 dark:border-gray-800 dark:bg-[#141622] dark:text-gray-300">
                {sortedLeaderboard.length === 0 || (sortedLeaderboard.length === 1 && playerWins === 0) ? (
                  <div>
                    <strong>Be the First Champion!</strong> No one has defeated Archie AI yet. Play a match to take Rank #1!
                  </div>
                ) : currentRank === 1 && playerWins > 0 ? (
                  <div>
                    <strong>Rank #1 Champion!</strong> You hold the top spot on the worldwide leaderboard. Keep winning to stay ahead!
                  </div>
                ) : (
                  <div>
                    You are currently <strong>Rank #{currentRank || 1}</strong> ({playerWins} win{playerWins === 1 ? '' : 's'}).
                    {prevRankPlayer && (
                      <span className="block mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                        Win {winsToClimb} more match{winsToClimb === 1 ? '' : 'es'} to surpass {prevRankPlayer.name} and claim <strong>Rank #{currentRank - 1}</strong>!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0d0e15]">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-100 text-[10px] uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-[#141622] dark:text-gray-400">
                      <th className="py-2.5 pl-3 pr-2 font-bold"># Rank</th>
                      <th className="py-2.5 px-2 font-bold">Player</th>
                      <th className="py-2.5 px-2 text-right font-bold">Wins (vs AI)</th>
                      <th className="py-2.5 pr-3 pl-2 text-right font-bold">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {sortedLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-xs text-gray-400 font-mono">
                          No matches won yet. Play a game to record the first victory!
                        </td>
                      </tr>
                    ) : (
                      sortedLeaderboard.map((entry, idx) => (
                        <tr
                          key={entry.id || idx}
                          className={`transition-colors ${
                            entry.isCurrent
                              ? 'bg-gray-100/90 font-bold text-gray-950 dark:bg-gray-800/60 dark:text-white'
                              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <td className="py-2.5 pl-3 pr-2 font-semibold text-gray-500 dark:text-gray-400 text-xs">
                            {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : `${idx + 1}`}
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                                {entry.name || 'Anonymous'}
                              </span>
                              {entry.isCurrent && (
                                <span className="rounded border border-emerald-500/40 bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-gray-950 dark:text-white">
                            {entry.wins}
                          </td>
                          <td className="py-2.5 pr-3 pl-2 text-right text-[10px] text-gray-500 dark:text-gray-400">
                            {entry.diff || 'Balanced'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={handleStartMatchClick}
                className="w-full rounded-xl bg-gray-950 text-white hover:bg-gray-800 py-3 font-mono text-xs font-bold transition-all cursor-pointer dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 shadow-sm"
              >
                {isNameValid ? `Play Match as ${playerName.trim()}` : 'Enter Name & Play Match'}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('lobby')
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 font-mono text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#12141e] dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
              >
                Back to Pre-Match Lobby
              </button>
            </div>
          </div>
        )}

        {/* ── 3. PLAYING & GAME OVER ARENA ── */}
        {(gameState === 'playing' || gameState === 'scored' || gameState === 'gameover') && (
          <>
            {/* Scoreboard & Match Info Ribbon */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 sm:px-6 transition-colors dark:border-gray-800/60 dark:bg-[#0e1017]">
              {/* Difficulty Switcher */}
              <div className="flex items-center gap-1.5">
                {DIFFICULTIES.map((d) => {
                  const active = difficulty === d.id
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => startMatch(d.id)}
                      className={`rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors cursor-pointer ${
                        active
                          ? 'bg-gray-900 text-white font-bold dark:bg-white dark:text-gray-950'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {d.label}
                    </button>
                  )
                })}
              </div>

              {/* Live Arcade Scoreboard HUD */}
              <div className="flex items-center gap-3 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400">AI</span>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400">{aiScore}</span>
                </div>
                <span className="text-gray-300 dark:text-gray-600 font-bold">:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{playerScore}</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate max-w-[80px] uppercase">
                    {playerName || 'YOU'}
                  </span>
                </div>

                {rallyCount > 2 && (
                  <span className="hidden sm:inline rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30">
                    Rally: {rallyCount}
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Canvas Area */}
            <div className="relative flex flex-1 items-center justify-center p-3 sm:p-5 bg-gray-50 dark:bg-[#08090d]">
              <canvas
                ref={canvasRef}
                width={TABLE_WIDTH}
                height={TABLE_HEIGHT}
                onMouseMove={(e) => updatePlayerPointer(e.clientX, e.clientY)}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    updatePlayerPointer(e.touches[0].clientX, e.touches[0].clientY)
                  }
                }}
                onTouchStart={(e) => {
                  if (e.touches[0]) {
                    updatePlayerPointer(e.touches[0].clientX, e.touches[0].clientY)
                  }
                }}
                className="w-full max-w-[380px] sm:max-w-[440px] aspect-[7/10] rounded-xl shadow-inner cursor-crosshair touch-none select-none border border-gray-200 dark:border-gray-800"
              />

              {/* Scored Point Toast Banner */}
              {scoreBanner && gameState === 'scored' && (
                <div className="pointer-events-none absolute inset-x-8 top-1/2 -translate-y-1/2 transform rounded-xl border border-gray-200 bg-white/95 dark:border-gray-700 dark:bg-black/90 px-5 py-4 text-center shadow-2xl backdrop-blur-md">
                  <div className="font-mono text-base sm:text-lg font-black tracking-widest text-gray-950 dark:text-white">
                    {scoreBanner}
                  </div>
                  <div className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
                    Next serve in progress...
                  </div>
                </div>
              )}

              {/* Game Over / Post-Match Overlay */}
              {gameState === 'gameover' && (
                <div className="absolute inset-x-6 sm:inset-x-12 top-1/2 -translate-y-1/2 transform rounded-2xl border border-gray-200 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-xl dark:border-gray-700 dark:bg-[#0f111a]/95">
                  <div className="font-mono text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Match Completed
                  </div>
                  <h3
                    className={`mt-1 font-mono text-2xl sm:text-3xl font-black tracking-tight ${
                      winner === 'player' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {winner === 'player' ? 'VICTORY' : 'DEFEAT'}
                  </h3>
                  <div className="my-3 font-mono text-xl font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">{playerScore}</span>
                    <span className="text-gray-400 dark:text-gray-500"> - </span>
                    <span className="text-rose-600 dark:text-rose-400">{aiScore}</span>
                  </div>

                  {winner === 'player' ? (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 font-mono text-xs text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                      +1 Win recorded on global leaderboard! Total Wins: <strong>{playerWins}</strong>
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Archie AI defended its net this round. Ready for revenge?
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => startMatch()}
                      className="w-full rounded-xl bg-gray-950 text-white hover:bg-gray-800 py-2.5 font-mono text-xs font-bold transition-all cursor-pointer dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 shadow-sm"
                    >
                      Play Again
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setGameState('leaderboard')
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 font-mono text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#141620] dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      View Worldwide Leaderboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setGameState('lobby')
                      }}
                      className="w-full rounded-xl border border-gray-200 py-2 font-mono text-xs text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      Return to Lobby
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tactile Controls Hint Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 font-mono text-[10px] text-gray-500 dark:border-gray-800/80 dark:bg-[#0e1017] dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">●</span>
                <span>Controls: Glide Mouse • Drag Touch • WASD Keys</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('lobby')
                }}
                className="hover:text-gray-950 dark:hover:text-white cursor-pointer underline underline-offset-2"
              >
                Exit to Lobby
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
