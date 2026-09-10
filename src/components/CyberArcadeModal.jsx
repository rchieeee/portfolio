import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { sounds } from '../utils/audio'
import {
  getStoredPlayerName,
  savePlayerName,
  getStoredPlayerWins,
  incrementPlayerWins,
  getCombinedLeaderboard,
} from '../utils/leaderboardService'

const WINNING_SCORE = 5
const TABLE_WIDTH = 420
const TABLE_HEIGHT = 600
const PADDLE_RADIUS = 24
const PUCK_RADIUS = 11
const GOAL_WIDTH = 150
const GOAL_LEFT = (TABLE_WIDTH - GOAL_WIDTH) / 2
const GOAL_RIGHT = GOAL_LEFT + GOAL_WIDTH

const DIFFICULTIES = [
  {
    id: 'casual',
    label: 'Casual',
    aiSpeed: 4.2,
    aiReaction: 0.82,
    strikePower: 1.05,
    desc: 'Relaxed pace & wider error tolerance for easy play.',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    aiSpeed: 6.2,
    aiReaction: 0.93,
    strikePower: 1.18,
    desc: 'Dynamic tracking, smart defense & tactical counter-strikes.',
  },
  {
    id: 'pro',
    label: 'Pro',
    aiSpeed: 8.4,
    aiReaction: 0.98,
    strikePower: 1.28,
    desc: 'Lightning reflexes, aggressive bounces & rapid pursuit.',
  },
]

export default function CyberArcadeModal({ isOpen, onClose }) {
  const canvasRef = useRef(null)
  const nameInputRef = useRef(null)

  // Player and Leaderboard State
  const [playerName, setPlayerName] = useState(() => getStoredPlayerName())
  const [playerWins, setPlayerWins] = useState(() => getStoredPlayerWins())
  const [nameError, setNameError] = useState(false)

  const [difficulty, setDifficulty] = useState('balanced')
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  // Game states: 'lobby' | 'playing' | 'scored' | 'gameover' | 'leaderboard'
  const [gameState, setGameState] = useState('lobby')
  const [winner, setWinner] = useState(null) // 'player' | 'ai'
  const [scoreBanner, setScoreBanner] = useState(null)

  const difficultyRef = useRef(difficulty)
  useEffect(() => {
    difficultyRef.current = difficulty
  }, [difficulty])

  const isNameValid = playerName.trim().length >= 2

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

  // Physics engine reference mutable state
  const sim = useRef({
    puck: { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT / 2, vx: 0, vy: 0, r: PUCK_RADIUS },
    player: {
      x: TABLE_WIDTH / 2,
      y: TABLE_HEIGHT - 70,
      vx: 0,
      vy: 0,
      r: PADDLE_RADIUS,
      targetX: TABLE_WIDTH / 2,
      targetY: TABLE_HEIGHT - 70,
    },
    ai: {
      x: TABLE_WIDTH / 2,
      y: 70,
      vx: 0,
      vy: 0,
      r: PADDLE_RADIUS,
      targetX: TABLE_WIDTH / 2,
      targetY: 70,
    },
    keys: { w: false, a: false, s: false, d: false, up: false, left: false, down: false, right: false },
    controlMode: 'mouse', // 'mouse' | 'touch' | 'keyboard'
    trail: [],
    particles: [],
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
    setWinner(null)
    setScoreBanner(null)
    setGameState('playing')

    const s = sim.current
    s.isOver = false
    s.freezeTimer = 0
    s.trail = []
    s.particles = []
    s.puck.x = TABLE_WIDTH / 2
    s.puck.y = TABLE_HEIGHT / 2
    s.puck.vx = (Math.random() - 0.5) * 4
    s.puck.vy = Math.random() > 0.5 ? 4 : -4
    s.player.x = TABLE_WIDTH / 2
    s.player.y = TABLE_HEIGHT - 70
    s.player.targetX = TABLE_WIDTH / 2
    s.player.targetY = TABLE_HEIGHT - 70
    s.player.vx = 0
    s.player.vy = 0
    s.ai.x = TABLE_WIDTH / 2
    s.ai.y = 70
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
    s.puck.vy = servedTo === 'player' ? 4 : -4
    s.player.targetX = TABLE_WIDTH / 2
    s.player.targetY = TABLE_HEIGHT - 70
    s.ai.x = TABLE_WIDTH / 2
    s.ai.y = 70
    s.ai.vx = 0
    s.ai.vy = 0
  }, [])

  // Spawn visual sparks
  const spawnSparks = (x, y, color = '#10b981', count = 16) => {
    const s = sim.current
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 4.5
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        color,
        size: 2 + Math.random() * 2.5,
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
    sim.current.player.targetY = Math.max(TABLE_HEIGHT / 2 + PADDLE_RADIUS + 5, Math.min(TABLE_HEIGHT - PADDLE_RADIUS, y))
  }

  // Record win against Archie AI in state and local storage
  const recordWin = useCallback(() => {
    const newWins = incrementPlayerWins()
    setPlayerWins(newWins)
  }, [])

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

  // Canvas 60fps simulation loop
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

      // ── 1. Update Physics (if not frozen and not game over) ──
      if (s.freezeTimer > 0) {
        s.freezeTimer -= 1
        if (s.freezeTimer === 0 && !s.isOver) {
          setScoreBanner(null)
          setGameState('playing')
        }
      } else if (!s.isOver) {
        // --- Player Movement ---
        if (s.controlMode === 'keyboard') {
          const speed = 7.5
          if (s.keys.left) s.player.x -= speed
          if (s.keys.right) s.player.x += speed
          if (s.keys.up) s.player.y -= speed
          if (s.keys.down) s.player.y += speed

          s.player.x = Math.max(PADDLE_RADIUS, Math.min(TABLE_WIDTH - PADDLE_RADIUS, s.player.x))
          s.player.y = Math.max(TABLE_HEIGHT / 2 + PADDLE_RADIUS + 5, Math.min(TABLE_HEIGHT - PADDLE_RADIUS, s.player.y))
          s.player.vx = (s.keys.right ? speed : 0) - (s.keys.left ? speed : 0)
          s.player.vy = (s.keys.down ? speed : 0) - (s.keys.up ? speed : 0)
        } else {
          // Smooth cursor / touch glide
          const prevX = s.player.x
          const prevY = s.player.y
          s.player.x += (s.player.targetX - s.player.x) * 0.45
          s.player.y += (s.player.targetY - s.player.y) * 0.45
          s.player.vx = s.player.x - prevX
          s.player.vy = s.player.y - prevY
        }

        // --- AI Movement ---
        const currentDiffConfig = DIFFICULTIES.find((d) => d.id === difficultyRef.current) || DIFFICULTIES[1]
        const aiSpeed = currentDiffConfig.aiSpeed
        let aiTargetX = TABLE_WIDTH / 2
        let aiTargetY = 85

        if (s.puck.y < TABLE_HEIGHT / 2 + 100) {
          aiTargetX = s.puck.x
          if (s.puck.y < TABLE_HEIGHT / 2 - 20) {
            aiTargetY = Math.min(TABLE_HEIGHT / 2 - PADDLE_RADIUS - 8, Math.max(40, s.puck.y - 25))
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

        // Clamp AI bounds
        s.ai.x = Math.max(PADDLE_RADIUS, Math.min(TABLE_WIDTH - PADDLE_RADIUS, s.ai.x))
        s.ai.y = Math.max(PADDLE_RADIUS + 4, Math.min(TABLE_HEIGHT / 2 - PADDLE_RADIUS - 5, s.ai.y))
        s.ai.vx = s.ai.x - prevAiX
        s.ai.vy = s.ai.y - prevAiY

        // --- Puck Movement & Friction ---
        s.puck.x += s.puck.vx
        s.puck.y += s.puck.vy
        s.puck.vx *= 0.995
        s.puck.vy *= 0.995

        // Trail recording
        s.trail.unshift({ x: s.puck.x, y: s.puck.y })
        if (s.trail.length > 8) s.trail.pop()

        // --- Wall Collisions ---
        // Left wall
        if (s.puck.x - s.puck.r <= 0) {
          s.puck.x = s.puck.r
          s.puck.vx = -s.puck.vx * 0.96
          sounds.play('tick')
          spawnSparks(s.puck.x, s.puck.y, '#38bdf8', 6)
        }
        // Right wall
        if (s.puck.x + s.puck.r >= TABLE_WIDTH) {
          s.puck.x = TABLE_WIDTH - s.puck.r
          s.puck.vx = -s.puck.vx * 0.96
          sounds.play('tick')
          spawnSparks(s.puck.x, s.puck.y, '#38bdf8', 6)
        }

        // Top wall (AI Goal zone)
        const isTopGoalX = s.puck.x >= GOAL_LEFT && s.puck.x <= GOAL_RIGHT
        if (s.puck.y - s.puck.r <= 0) {
          if (isTopGoalX) {
            // GOAL FOR PLAYER!
            sounds.play('chime')
            spawnSparks(s.puck.x, 20, '#10b981', 32)
            setPlayerScore((prev) => {
              const next = prev + 1
              if (next >= WINNING_SCORE) {
                s.isOver = true
                setGameState('gameover')
                setWinner('player')
                recordWin()
              } else {
                setGameState('scored')
                setScoreBanner('POINT FOR YOU!')
                s.freezeTimer = 65
                servePuck('ai')
              }
              return next
            })
          } else {
            s.puck.y = s.puck.r
            s.puck.vy = -s.puck.vy * 0.96
            sounds.play('tick')
            spawnSparks(s.puck.x, s.puck.y, '#38bdf8', 6)
          }
        }

        // Bottom wall (Player Goal zone)
        const isBottomGoalX = s.puck.x >= GOAL_LEFT && s.puck.x <= GOAL_RIGHT
        if (s.puck.y + s.puck.r >= TABLE_HEIGHT) {
          if (isBottomGoalX) {
            // GOAL FOR AI!
            sounds.play('droplet')
            spawnSparks(s.puck.x, TABLE_HEIGHT - 20, '#f43f5e', 32)
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
            spawnSparks(s.puck.x, s.puck.y, '#38bdf8', 6)
          }
        }

        // --- Paddle Collisions (Player & AI) ---
        const handlePaddleCollision = (paddle, isAI = false) => {
          const dx = s.puck.x - paddle.x
          const dy = s.puck.y - paddle.y
          const dist = Math.hypot(dx, dy)
          const minDist = s.puck.r + paddle.r

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist
            const ny = dy / dist

            // Resolve overlap
            s.puck.x = paddle.x + nx * minDist
            s.puck.y = paddle.y + ny * minDist

            // Relative velocity
            const rvx = s.puck.vx - paddle.vx
            const rvy = s.puck.vy - paddle.vy
            const velAlongNormal = rvx * nx + rvy * ny

            if (velAlongNormal < 0) {
              const restitution = 1.15
              const impulse = -(1 + restitution) * velAlongNormal
              s.puck.vx += nx * impulse + paddle.vx * 0.38
              s.puck.vy += ny * impulse + paddle.vy * 0.38

              const speed = Math.hypot(s.puck.vx, s.puck.vy)
              const maxSpeed = 16.5
              if (speed > maxSpeed) {
                s.puck.vx = (s.puck.vx / speed) * maxSpeed
                s.puck.vy = (s.puck.vy / speed) * maxSpeed
              } else if (speed < 4) {
                s.puck.vx = (s.puck.vx / (speed || 1)) * 4
                s.puck.vy = (s.puck.vy / (speed || 1)) * 4
              }

              sounds.play('press')
              spawnSparks(s.puck.x, s.puck.y, isAI ? '#f43f5e' : '#10b981', 12)
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
      ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT)

      // Table Felt Background
      const grad = ctx.createLinearGradient(0, 0, 0, TABLE_HEIGHT)
      grad.addColorStop(0, '#090a0f')
      grad.addColorStop(0.5, '#0d0f17')
      grad.addColorStop(1, '#090a0f')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT)

      // Court Subtle Grid Pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
      ctx.lineWidth = 1
      for (let x = 30; x < TABLE_WIDTH; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, TABLE_HEIGHT)
        ctx.stroke()
      }
      for (let y = 30; y < TABLE_HEIGHT; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(TABLE_WIDTH, y)
        ctx.stroke()
      }

      // Center Divider Line
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 6])
      ctx.beginPath()
      ctx.moveTo(0, TABLE_HEIGHT / 2)
      ctx.lineTo(TABLE_WIDTH, TABLE_HEIGHT / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Center Face-Off Circle
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, TABLE_HEIGHT / 2, 50, 0, Math.PI * 2)
      ctx.stroke()

      // Center dot
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, TABLE_HEIGHT / 2, 4, 0, Math.PI * 2)
      ctx.fill()

      // Goal Lines & Arcs
      // AI Goal (Top)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, 0, 60, 0, Math.PI)
      ctx.stroke()
      ctx.fillStyle = 'rgba(244, 63, 94, 0.12)'
      ctx.fillRect(GOAL_LEFT, 0, GOAL_WIDTH, 8)

      // Player Goal (Bottom)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(TABLE_WIDTH / 2, TABLE_HEIGHT, 60, Math.PI, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)'
      ctx.fillRect(GOAL_LEFT, TABLE_HEIGHT - 8, GOAL_WIDTH, 8)

      // Table Boundary Outer Border
      ctx.strokeStyle = '#1e293b'
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
        const opacity = (1 - i / s.trail.length) * 0.25
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, s.puck.r * (0.8 - i * 0.05), 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw Puck
      ctx.save()
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 10
      ctx.fillStyle = '#f8fafc'
      ctx.beginPath()
      ctx.arc(s.puck.x, s.puck.y, s.puck.r, 0, Math.PI * 2)
      ctx.fill()

      // Puck inner ring
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(s.puck.x, s.puck.y, s.puck.r * 0.55, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // Draw AI Mallet (Crimson / Coral)
      ctx.save()
      ctx.shadowColor = '#f43f5e'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#f43f5e'
      ctx.beginPath()
      ctx.arc(s.ai.x, s.ai.y, s.ai.r, 0, Math.PI * 2)
      ctx.fill()

      // AI Inner handle
      ctx.fillStyle = '#9f1239'
      ctx.beginPath()
      ctx.arc(s.ai.x, s.ai.y, s.ai.r * 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fecdd3'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(s.ai.x, s.ai.y, s.ai.r * 0.3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // Draw Player Mallet (Emerald / Cyan)
      ctx.save()
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(s.player.x, s.player.y, s.player.r, 0, Math.PI * 2)
      ctx.fill()

      // Player Inner handle
      ctx.fillStyle = '#065f46'
      ctx.beginPath()
      ctx.arc(s.player.x, s.player.y, s.player.r * 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#a7f3d0'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(s.player.x, s.player.y, s.player.r * 0.3, 0, Math.PI * 2)
      ctx.stroke()
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

  // Compute live sorted leaderboard
  const currentDiffLabel = DIFFICULTIES.find((d) => d.id === difficulty)?.label || 'Balanced'
  const sortedLeaderboard = useMemo(() => {
    return getCombinedLeaderboard(playerName, playerWins, currentDiffLabel)
  }, [playerName, playerWins, currentDiffLabel])

  // Current visitor rank and gap to next rank
  const currentRank = sortedLeaderboard.findIndex((e) => e.isCurrent) + 1
  const prevRankPlayer = currentRank > 1 ? sortedLeaderboard[currentRank - 2] : null
  const winsToClimb = prevRankPlayer ? Math.max(1, prevRankPlayer.wins - playerWins + 1) : 0

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Arcade Frame */}
      <div className="relative z-10 flex max-h-[96vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#0c0d12] shadow-2xl">
        {/* Top Control Header */}
        <div className="flex items-center justify-between border-b border-gray-800/80 bg-[#12141c] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Cyber Air Hockey
              </h2>
              <p className="font-mono text-[10px] text-gray-400">
                vs Archie AI • First to {WINNING_SCORE}
              </p>
            </div>
          </div>

          {/* Header Action Controls (No Reset Button) */}
          <div className="flex items-center gap-2">
            {gameState === 'leaderboard' ? (
              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('lobby')
                }}
                className="rounded border border-gray-700 bg-gray-800/80 px-2 py-1 font-mono text-[11px] text-gray-300 hover:border-gray-500 hover:bg-gray-700 hover:text-white cursor-pointer"
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
                className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                title="View Arena Leaderboards"
              >
                Leaderboard
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
              aria-label="Close Arcade"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── 1. PRE-GAME LOBBY SCREEN ── */}
        {gameState === 'lobby' && (
          <div className="flex flex-col p-5 space-y-4 bg-[#090a0f] text-gray-200 min-h-[500px] justify-between">
            <div className="space-y-4">
              {/* Title & Introduction */}
              <div className="rounded-xl border border-gray-800 bg-[#10121a] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Pre-Match Lobby
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">
                    Your Record: <strong className="text-emerald-400">{playerWins}</strong> Win{playerWins === 1 ? '' : 's'}
                  </span>
                </div>
                <h3 className="mt-1 font-mono text-base font-bold text-white">
                  Ready to face Archie AI?
                </h3>
                <p className="mt-1 font-mono text-xs text-gray-400 leading-relaxed">
                  Enter your name to register your challenger slot. Win matches to climb to Rank #1 on the leaderboard!
                </p>
              </div>

              {/* Player Name / Handle Input (Mandatory) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                    <span>Player Name / Call-Sign</span>
                    <span className="text-emerald-400 text-[10px] font-normal">• Required</span>
                  </label>
                  {nameError && (
                    <span className="font-mono text-[10px] font-bold text-rose-400">
                      Enter at least 2 letters
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
                    placeholder="Enter your name to unlock the arena..."
                    className={`w-full rounded-xl border bg-[#12141e] px-3.5 py-2.5 font-mono text-xs text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-1 ${
                      nameError
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 bg-rose-950/15'
                        : isNameValid
                        ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500'
                        : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 font-mono text-[10px] text-gray-500">
                    {playerName.length}/18
                  </span>
                </div>
                <p className="font-mono text-[10px] text-gray-400">
                  {isNameValid
                    ? `Registered as "${playerName.trim()}". Wins will be added to your leaderboard rank.`
                    : 'Visitors must input their name first before playing so scores are tracked.'}
                </p>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold text-gray-300 uppercase tracking-wide">
                  Select AI Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 font-mono transition-all cursor-pointer ${
                          active
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold shadow-sm'
                            : 'border-gray-800 bg-[#12141e] text-gray-400 hover:border-gray-700 hover:text-gray-200'
                        }`}
                      >
                        <span className="text-xs uppercase">{d.label}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="font-mono text-[11px] text-gray-400 bg-[#10121a] rounded-lg px-3 py-1.5 border border-gray-800/80">
                  {DIFFICULTIES.find((d) => d.id === difficulty)?.desc}
                </p>
              </div>

              {/* Controls Hint */}
              <div className="rounded-xl border border-gray-800/80 bg-[#0d0e14] p-3 font-mono text-[11px] text-gray-400 space-y-1">
                <div className="text-gray-300 font-bold text-[10px] uppercase tracking-wider">
                  Tactile Controls
                </div>
                <div>• Mouse: Move cursor to position your paddle</div>
                <div>• Touch: Drag finger directly on screen</div>
                <div>• Keyboard: W, A, S, D or Arrow Keys</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleStartMatchClick}
                className={`w-full rounded-xl py-3 font-mono text-xs font-bold transition-all cursor-pointer ${
                  isNameValid
                    ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 active:scale-98 shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-800/90 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-gray-700'
                }`}
              >
                {isNameValid
                  ? `Start Match as ${playerName.trim()} vs Archie AI`
                  : 'Enter Your Name Above to Play'}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('leaderboard')
                }}
                className="w-full rounded-xl border border-gray-700 bg-[#141620] py-2.5 font-mono text-xs font-semibold text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                View Leaderboard ({playerWins} Win{playerWins === 1 ? '' : 's'})
              </button>
            </div>
          </div>
        )}

        {/* ── 2. LEADERBOARD SCREEN ── */}
        {gameState === 'leaderboard' && (
          <div className="flex flex-col p-5 space-y-4 bg-[#090a0f] text-gray-200 min-h-[500px] justify-between">
            <div className="space-y-3">
              {/* Leaderboard Header */}
              <div className="rounded-xl border border-gray-800 bg-[#10121a] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Leaderboard
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">
                    Your Record: <strong className="text-emerald-400">{playerWins}</strong> Win{playerWins === 1 ? '' : 's'}
                  </span>
                </div>
                <h3 className="mt-1 font-mono text-base font-bold text-white">
                  Wins Against Archie AI
                </h3>
                <p className="mt-0.5 font-mono text-xs text-gray-400">
                  Hall of fame rankings for visitors challenging Archie AI.
                </p>
              </div>

              {/* Competitive Rank Status Callout */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 font-mono text-xs text-emerald-300">
                {currentRank === 1 ? (
                  <div>
                    <strong>Rank #1!</strong> You hold the top spot against Archie AI. Defend your throne!
                  </div>
                ) : (
                  <div>
                    You are currently <strong>Rank #{currentRank}</strong> ({playerWins} win{playerWins === 1 ? '' : 's'}).
                    {prevRankPlayer && (
                      <span className="text-emerald-200 block mt-0.5 text-[11px]">
                        Win {winsToClimb} more match{winsToClimb === 1 ? '' : 'es'} to surpass {prevRankPlayer.name} and reach <strong>Rank #{currentRank - 1}</strong>!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0d0e15]">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 bg-[#141622] text-[10px] uppercase tracking-wider text-gray-400">
                      <th className="py-2.5 pl-3 pr-2 font-bold">#</th>
                      <th className="py-2.5 px-2 font-bold">Player</th>
                      <th className="py-2.5 px-2 text-right font-bold">Wins (vs AI)</th>
                      <th className="py-2.5 pr-3 pl-2 text-right font-bold">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {sortedLeaderboard.map((entry, idx) => (
                      <tr
                        key={entry.id}
                        className={`transition-colors ${
                          entry.isCurrent
                            ? 'bg-emerald-500/15 font-bold text-emerald-300'
                            : 'text-gray-300 hover:bg-gray-800/40'
                        }`}
                      >
                        <td className="py-2.5 pl-3 pr-2 text-gray-400 text-[11px]">
                          {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : `${idx + 1}`}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[125px]">
                              {entry.name || 'Anonymous'}
                            </span>
                            {entry.isCurrent && (
                              <span className="rounded border border-emerald-500/40 bg-emerald-500/20 px-1 py-0.5 text-[9px] font-bold text-emerald-400">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-emerald-400">
                          {entry.wins}
                        </td>
                        <td className="py-2.5 pr-3 pl-2 text-right text-[10px] text-gray-400">
                          {entry.diff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-gray-800/60 bg-[#10121a] px-3 py-2 font-mono text-[10px] text-gray-400">
                To reach Rank #1, you must accumulate more total wins against Archie AI than anyone else.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleStartMatchClick}
                className="w-full rounded-xl bg-emerald-500 py-3 font-mono text-xs font-bold text-gray-950 hover:bg-emerald-400 active:scale-98 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {isNameValid ? `Play Match as ${playerName.trim()}` : 'Enter Name & Play Match'}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('lobby')
                }}
                className="w-full rounded-xl border border-gray-700 bg-[#141620] py-2.5 font-mono text-xs font-semibold text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                Back to Pre-Match Lobby
              </button>
            </div>
          </div>
        )}

        {/* ── 3. PLAYING & GAME OVER ARENA ── */}
        {(gameState === 'playing' || gameState === 'scored' || gameState === 'gameover') && (
          <>
            {/* Scoreboard & Difficulty Ribbon */}
            <div className="flex items-center justify-between border-b border-gray-800/60 bg-[#0e1017] px-4 py-2">
              {/* Difficulty Switcher */}
              <div className="flex items-center gap-1">
                {DIFFICULTIES.map((d) => {
                  const active = difficulty === d.id
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => startMatch(d.id)}
                      className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40 border border-transparent'
                      }`}
                    >
                      {d.label}
                    </button>
                  )
                })}
              </div>

              {/* Live Score Display */}
              <div className="flex items-center gap-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">AI</span>
                  <span className="text-sm font-bold text-rose-400">{aiScore}</span>
                </div>
                <span className="text-gray-600">:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-emerald-400">{playerScore}</span>
                  <span className="text-[10px] text-gray-400 truncate max-w-[70px] uppercase">
                    {playerName || 'YOU'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Canvas Area */}
            <div className="relative flex flex-1 items-center justify-center p-3 sm:p-4 bg-[#08090d]">
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
                className="w-full max-w-[360px] aspect-[7/10] rounded-xl shadow-inner cursor-crosshair touch-none select-none"
              />

              {/* Scored Point Toast Banner */}
              {scoreBanner && gameState === 'scored' && (
                <div className="pointer-events-none absolute inset-x-8 top-1/2 -translate-y-1/2 transform rounded-xl border border-emerald-500/40 bg-black/90 px-4 py-3 text-center shadow-2xl backdrop-blur-md">
                  <div className="font-mono text-sm font-black tracking-widest text-emerald-400">
                    {scoreBanner}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-gray-400">
                    Next serve in progress...
                  </div>
                </div>
              )}

              {/* Game Over / Post-Match Overlay */}
              {gameState === 'gameover' && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 transform rounded-2xl border border-gray-700 bg-[#0f111a]/95 p-6 text-center shadow-2xl backdrop-blur-xl">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
                    Match Finished
                  </div>
                  <h3
                    className={`mt-1 font-mono text-2xl font-black tracking-tight ${
                      winner === 'player' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {winner === 'player' ? 'VICTORY' : 'DEFEAT'}
                  </h3>
                  <div className="my-3 font-mono text-lg font-bold text-white">
                    <span className="text-emerald-400">{playerScore}</span>
                    <span className="text-gray-500"> - </span>
                    <span className="text-rose-400">{aiScore}</span>
                  </div>

                  {winner === 'player' ? (
                    <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 font-mono text-xs text-emerald-300">
                      +1 Win recorded against Archie AI! You now have <strong>{playerWins}</strong> win{playerWins === 1 ? '' : 's'} (Rank #{currentRank})
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-gray-400 mb-4">
                      Archie AI held the line this time. Ready for revenge?
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => startMatch()}
                      className="w-full rounded-xl bg-emerald-500 py-2.5 font-mono text-xs font-bold text-gray-950 hover:bg-emerald-400 active:scale-98 transition-all cursor-pointer"
                    >
                      Play Again
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setGameState('leaderboard')
                      }}
                      className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2 font-mono text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                    >
                      View Leaderboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setGameState('lobby')
                      }}
                      className="w-full rounded-xl border border-gray-700 py-2 font-mono text-xs text-gray-300 hover:bg-gray-800 cursor-pointer"
                    >
                      Return to Lobby
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tactile Controls Hint Footer */}
            <div className="flex items-center justify-between border-t border-gray-800/80 bg-[#0e1017] px-4 py-2 font-mono text-[10px] text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">●</span>
                <span>Controls: Mouse glide • Touch drag • WASD keys</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setGameState('lobby')
                }}
                className="text-gray-400 hover:text-white cursor-pointer underline underline-offset-2"
              >
                Back to Lobby
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
