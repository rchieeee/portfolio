import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { sounds } from '../utils/audio'

// Shared Global Room ID for real-time multiplayer across all portfolio tabs & visitors
const ROOM_CHANNEL = 'archie_cyber_sumo_3d_real'
const ARENA_RADIUS = 11.5

const PLAYER_COLORS = [0x22c55e, 0x38bdf8, 0xa855f7, 0xfb923c, 0xec4899, 0xfacc15]

export default function CyberArcadeModal({ isOpen, onClose }) {
  const mountRef = useRef(null)
  const [playerId] = useState(() => 'player_' + Math.floor(1000 + Math.random() * 9000))
  const [playerName, setPlayerName] = useState(() => 'Player_' + Math.floor(100 + Math.random() * 900))
  const [playerColor] = useState(() => PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)])
  const [isEditingName, setIsEditingName] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Multiplayer Arena Ready! Open another tab to test 1v1 on localhost.', time: '00:00' },
  ])
  const [scores, setScores] = useState({})
  const [onlineCount, setOnlineCount] = useState(1)

  // Mutable Game Loop State
  const gameRef = useRef({
    myPos: {
      x: (Math.random() - 0.5) * 6,
      y: 0,
      z: (Math.random() - 0.5) * 6,
      vx: 0,
      vz: 0,
      rotY: 0,
      score: 0,
      isFalling: false,
      isHeavy: false,
      hasShield: false,
      lastBumperId: null,
    },
    remotePlayers: {}, // { id: { name, x, y, z, vx, vz, rotY, score, color, isFalling, lastSeen } }
    powerups: [
      { id: 1, type: 'coffee', x: -5, z: -4, active: true },
      { id: 2, type: 'nitro', x: 5, z: 4, active: true },
      { id: 3, type: 'shield', x: -4, z: 5, active: true },
    ],
    keys: {},
    chatBubbles: {}, // { id: { text, timer } }
    channel: null,
    scene: null,
    camera: null,
    renderer: null,
    meshMap: {}, // id -> THREE.Group
    powerupMeshes: [],
  })

  // 1. Networking (BroadcastChannel for Pure Real-Human Multiplayer)
  useEffect(() => {
    if (!isOpen) return

    let bc = null
    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        bc = new BroadcastChannel(ROOM_CHANNEL)
        gameRef.current.channel = bc

        bc.onmessage = (event) => {
          const { type, payload } = event.data
          if (type === 'PLAYER_STATE') {
            if (payload.id !== playerId) {
              gameRef.current.remotePlayers[payload.id] = {
                ...(gameRef.current.remotePlayers[payload.id] || {}),
                ...payload,
                lastSeen: Date.now(),
              }
            }
          } else if (type === 'BUMP_EVENT') {
            if (payload.targetId === playerId) {
              // We were bumped by another real player! Apply knockback
              sounds.play('press')
              gameRef.current.myPos.vx += payload.impulseX
              gameRef.current.myPos.vz += payload.impulseZ
              gameRef.current.myPos.lastBumperId = payload.sourceId
            }
          } else if (type === 'PLAYER_KO') {
            sounds.play('success')
            if (payload.killerId === playerId) {
              gameRef.current.myPos.score += 1
            }
          } else if (type === 'CHAT_MESSAGE') {
            sounds.play('tick')
            setChatMessages((prev) => [...prev.slice(-20), payload])
            gameRef.current.chatBubbles[payload.id] = {
              text: payload.text,
              timer: Date.now() + 4000,
            }
          }
        }
      }
    } catch {}

    // Periodic Heartbeat & Disconnection Cleaner
    const hbInterval = setInterval(() => {
      if (bc) {
        bc.postMessage({
          type: 'PLAYER_STATE',
          payload: {
            id: playerId,
            name: playerName,
            x: gameRef.current.myPos.x,
            y: gameRef.current.myPos.y,
            z: gameRef.current.myPos.z,
            vx: gameRef.current.myPos.vx,
            vz: gameRef.current.myPos.vz,
            rotY: gameRef.current.myPos.rotY,
            score: gameRef.current.myPos.score,
            color: playerColor,
          },
        })
      }

      // Remove inactive players who closed tab
      const now = Date.now()
      const remotes = gameRef.current.remotePlayers
      const scene = gameRef.current.scene
      const meshMap = gameRef.current.meshMap

      let count = 1
      Object.keys(remotes).forEach((k) => {
        if (now - remotes[k].lastSeen > 4500) {
          if (meshMap[k] && scene) {
            scene.remove(meshMap[k])
            delete meshMap[k]
          }
          delete remotes[k]
        } else {
          count++
        }
      })
      setOnlineCount(count)
    }, 1000)

    return () => {
      clearInterval(hbInterval)
      if (bc) bc.close()
    }
  }, [isOpen, playerId, playerName, playerColor])

  // 2. Keyboard Event Handlers
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return
      gameRef.current.keys[e.key.toLowerCase()] = true
      gameRef.current.keys[e.code] = true
    }

    const onKeyUp = (e) => {
      gameRef.current.keys[e.key.toLowerCase()] = false
      gameRef.current.keys[e.code] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isOpen])

  // 3. Three.js 3D WebGL Scene & Game Loop
  useEffect(() => {
    if (!isOpen || !mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth || 600
    const height = container.clientHeight || 400

    // Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0c0d12)
    scene.fog = new THREE.FogExp2(0x0c0d12, 0.02)
    gameRef.current.scene = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 24, 20)
    camera.lookAt(0, 0, 0)
    gameRef.current.camera = camera

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.innerHTML = ''
    container.appendChild(renderer.domElement)
    gameRef.current.renderer = renderer

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3)
    dirLight.position.set(12, 24, 12)
    dirLight.castShadow = true
    scene.add(dirLight)

    // Floating Circular Sumo Platform (3D Cylindrical Island)
    const islandGeo = new THREE.CylinderGeometry(ARENA_RADIUS, ARENA_RADIUS + 0.5, 1.5, 48)
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x141620,
      roughness: 0.7,
      metalness: 0.2,
    })
    const island = new THREE.Mesh(islandGeo, islandMat)
    island.position.y = -0.75
    island.receiveShadow = true
    scene.add(island)

    // Platform Glowing Outer Neon Ring
    const ringGeo = new THREE.RingGeometry(ARENA_RADIUS - 0.2, ARENA_RADIUS, 48)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    scene.add(ring)

    // Helper: Build Cute 3D Minimalist Cartoon Character
    const createCartoonCharacter = (colorHex) => {
      const group = new THREE.Group()

      // Cute Rounded Chibi Body
      const bodyGeo = new THREE.SphereGeometry(0.85, 20, 20)
      bodyGeo.scale(1, 1.15, 1)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.2,
        metalness: 0.1,
      })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.y = 0.9
      body.castShadow = true
      group.add(body)

      // Expressive Cartoon Left Eye
      const eyeGeo = new THREE.SphereGeometry(0.2, 12, 12)
      eyeGeo.scale(1, 1.3, 0.6)
      const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const eyeL = new THREE.Mesh(eyeGeo, eyeWhiteMat)
      eyeL.position.set(-0.3, 1.1, 0.75)
      group.add(eyeL)

      // Pupil Left
      const pupilGeo = new THREE.SphereGeometry(0.09, 8, 8)
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 })
      const pupilL = new THREE.Mesh(pupilGeo, pupilMat)
      pupilL.position.set(-0.3, 1.1, 0.88)
      group.add(pupilL)

      // Expressive Cartoon Right Eye
      const eyeR = new THREE.Mesh(eyeGeo, eyeWhiteMat)
      eyeR.position.set(0.3, 1.1, 0.75)
      group.add(eyeR)

      // Pupil Right
      const pupilR = new THREE.Mesh(pupilGeo, pupilMat)
      pupilR.position.set(0.3, 1.1, 0.88)
      group.add(pupilR)

      // Cute Cheeks / Blush
      const blushGeo = new THREE.CircleGeometry(0.12, 12)
      const blushMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.6 })
      const blushL = new THREE.Mesh(blushGeo, blushMat)
      blushL.position.set(-0.48, 0.85, 0.76)
      blushL.rotation.y = -0.3
      group.add(blushL)

      const blushR = new THREE.Mesh(blushGeo, blushMat)
      blushR.position.set(0.48, 0.85, 0.76)
      blushR.rotation.y = 0.3
      group.add(blushR)

      return group
    }

    // Create Local Player Cartoon Mesh
    const localMesh = createCartoonCharacter(playerColor)
    scene.add(localMesh)
    gameRef.current.meshMap[playerId] = localMesh

    // Create 3D Powerup Meshes
    const pMeshes = []
    gameRef.current.powerups.forEach((pu) => {
      const geo = pu.type === 'coffee'
        ? new THREE.CylinderGeometry(0.38, 0.3, 0.6, 16)
        : pu.type === 'nitro'
        ? new THREE.ConeGeometry(0.4, 0.8, 12)
        : new THREE.SphereGeometry(0.45, 16, 16)

      const mat = new THREE.MeshStandardMaterial({
        color: pu.type === 'coffee' ? 0xf59e0b : pu.type === 'nitro' ? 0xef4444 : 0x38bdf8,
        emissive: pu.type === 'coffee' ? 0xb45309 : pu.type === 'nitro' ? 0x991b1b : 0x0369a1,
        emissiveIntensity: 0.6,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(pu.x, 0.6, pu.z)
      scene.add(mesh)
      pMeshes.push({ mesh, data: pu })
    })
    gameRef.current.powerupMeshes = pMeshes

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // ── 60FPS Physics & Elastic Collision Game Loop ──
    let reqId
    const loop = () => {
      const { myPos, keys, remotePlayers, channel, meshMap } = gameRef.current

      // 1. Local Player Movement & Acceleration
      const accel = myPos.isHeavy ? 0.018 : 0.024
      const maxSpeed = myPos.isHeavy ? 0.18 : 0.22

      if (!myPos.isFalling) {
        if (keys['w'] || keys['arrowup'] || keys['KeyW']) myPos.vz -= accel
        if (keys['s'] || keys['arrowdown'] || keys['KeyS']) myPos.vz += accel
        if (keys['a'] || keys['arrowleft'] || keys['KeyA']) myPos.vx -= accel
        if (keys['d'] || keys['arrowright'] || keys['KeyD']) myPos.vx += accel

        // Clamp speed
        const speed = Math.hypot(myPos.vx, myPos.vz)
        if (speed > maxSpeed) {
          myPos.vx = (myPos.vx / speed) * maxSpeed
          myPos.vz = (myPos.vz / speed) * maxSpeed
        }

        // Apply friction
        myPos.vx *= 0.94
        myPos.vz *= 0.94

        myPos.x += myPos.vx
        myPos.z += myPos.vz

        // Calculate rotation angle towards movement
        if (Math.hypot(myPos.vx, myPos.vz) > 0.01) {
          myPos.rotY = Math.atan2(myPos.vx, myPos.vz)
        }

        // Check if Fallen Off Edge of Floating Sumo Platform
        const distFromCenter = Math.hypot(myPos.x, myPos.z)
        if (distFromCenter > ARENA_RADIUS) {
          myPos.isFalling = true
          sounds.play('droplet')

          // Bisdak quip when falling
          setChatMessages((prev) => [
            ...prev.slice(-20),
            { sender: playerName, text: 'Yawa nahagbong ko! 😂', time: '00:00' },
          ])

          if (myPos.lastBumperId && channel) {
            channel.postMessage({
              type: 'PLAYER_KO',
              payload: { killerId: myPos.lastBumperId, victimId: playerId },
            })
          }
        }
      } else {
        // Falling animation down into the void
        myPos.y -= 0.35
        myPos.rotY += 0.15

        if (myPos.y < -16) {
          // Respawn in center
          myPos.x = (Math.random() - 0.5) * 4
          myPos.z = (Math.random() - 0.5) * 4
          myPos.y = 0
          myPos.vx = 0
          myPos.vz = 0
          myPos.isFalling = false
          myPos.lastBumperId = null
        }
      }

      // Update Local 3D Mesh
      if (localMesh) {
        localMesh.position.set(myPos.x, myPos.y, myPos.z)
        localMesh.rotation.y = myPos.rotY

        // Cute Bouncy Squash & Stretch
        const moveMagnitude = Math.hypot(myPos.vx, myPos.vz)
        const bounce = 1 + Math.sin(Date.now() * 0.015) * moveMagnitude * 2
        localMesh.scale.set(myPos.isHeavy ? 1.4 : 1, myPos.isHeavy ? 1.4 : bounce, myPos.isHeavy ? 1.4 : 1)
      }

      // Broadcast Movement
      if (channel) {
        channel.postMessage({
          type: 'PLAYER_STATE',
          payload: {
            id: playerId,
            name: playerName,
            x: myPos.x,
            y: myPos.y,
            z: myPos.z,
            vx: myPos.vx,
            vz: myPos.vz,
            rotY: myPos.rotY,
            score: myPos.score,
            color: playerColor,
            isFalling: myPos.isFalling,
          },
        })
      }

      // 2. Render & Sync Real Remote Players (From other localhost tabs / live visitors)
      Object.values(remotePlayers).forEach((other) => {
        if (!meshMap[other.id]) {
          const rMesh = createCartoonCharacter(other.color || 0x38bdf8)
          scene.add(rMesh)
          meshMap[other.id] = rMesh
        }

        const rMesh = meshMap[other.id]
        if (rMesh) {
          // Smooth interpolation towards received position
          rMesh.position.lerp(new THREE.Vector3(other.x, other.y || 0, other.z), 0.35)
          rMesh.rotation.y = other.rotY || 0
        }
      })

      // 3. Elastic Bumper Momentum Collisions (Ramming Mechanics with Real Players)
      Object.values(remotePlayers).forEach((other) => {
        if (myPos.isFalling || other.isFalling) return
        const dist = Math.hypot(myPos.x - other.x, myPos.z - other.z)
        const hitRadius = myPos.isHeavy ? 1.6 : 1.3

        if (dist < hitRadius) {
          sounds.play('press')
          const dx = (myPos.x - other.x) / (dist || 1)
          const dz = (myPos.z - other.z) / (dist || 1)

          const force = myPos.isHeavy ? 0.45 : 0.26

          // Apply recoil to You
          myPos.vx += dx * (force * 0.7)
          myPos.vz += dz * (force * 0.7)

          // Send knockback impulse packet to the other real player's tab
          if (channel) {
            channel.postMessage({
              type: 'BUMP_EVENT',
              payload: {
                targetId: other.id,
                sourceId: playerId,
                impulseX: -dx * force,
                impulseZ: -dz * force,
              },
            })
          }
        }
      })

      // 4. Power-Up Pickups & Floating Rotations
      const now = Date.now()
      pMeshes.forEach(({ mesh, data }) => {
        mesh.rotation.y += 0.04
        mesh.position.y = 0.6 + Math.sin(now * 0.004 + data.id) * 0.15

        // Check local pickup
        const dist = Math.hypot(myPos.x - data.x, myPos.z - data.z)
        if (dist < 1.3 && data.active && !myPos.isFalling) {
          sounds.play('success')
          data.active = false
          mesh.visible = false

          if (data.type === 'coffee') {
            myPos.isHeavy = true
            setTimeout(() => (myPos.isHeavy = false), 6000)
          } else if (data.type === 'nitro') {
            myPos.vx *= 2.5
            myPos.vz *= 2.5
          }

          setTimeout(() => {
            data.active = true
            mesh.visible = true
            const angle = Math.random() * Math.PI * 2
            const r = Math.random() * (ARENA_RADIUS - 3)
            data.x = Math.cos(angle) * r
            data.z = Math.sin(angle) * r
            mesh.position.set(data.x, 0.6, data.z)
          }, 9000)
        }
      })

      // Update Live Scoreboard
      const currentScores = { [playerName]: myPos.score }
      Object.values(remotePlayers).forEach((p) => {
        currentScores[p.name || p.id] = p.score || 0
      })
      setScores(currentScores)

      renderer.render(scene, camera)
      reqId = requestAnimationFrame(loop)
    }

    reqId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [isOpen, playerId, playerName, playerColor])

  // Send In-Game Chat Message
  const handleSendChat = (e) => {
    e?.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed) return

    sounds.play('tick')
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const msgObj = {
      id: playerId,
      sender: playerName,
      text: trimmed,
      time: timeStr,
    }

    setChatMessages((prev) => [...prev.slice(-20), msgObj])
    gameRef.current.chatBubbles[playerId] = {
      text: trimmed,
      timer: Date.now() + 4000,
    }

    if (gameRef.current.channel) {
      gameRef.current.channel.postMessage({
        type: 'CHAT_MESSAGE',
        payload: msgObj,
      })
    }

    setChatInput('')
  }

  // Quick Bisdak Reaction Buttons
  const handleQuickChat = (text) => {
    setChatInput(text)
    setTimeout(() => handleSendChat(), 40)
  }

  // Mobile Touch Controls
  const handleTouchMove = (direction) => {
    const { myPos } = gameRef.current
    const step = 0.18
    if (direction === 'up') myPos.vz -= step
    if (direction === 'down') myPos.vz += step
    if (direction === 'left') myPos.vx -= step
    if (direction === 'right') myPos.vx += step
  }

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

      {/* Main 3D Arcade Modal Frame */}
      <div className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-gray-800 bg-[#0c0d12] shadow-2xl text-gray-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-800 px-5 py-3.5 bg-[#12131a]">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-sm font-bold tracking-tight text-white">
              CYBER SUMO 3D <span className="text-emerald-400 font-normal text-xs">[Multiplayer Bumper 🤼‍♂️]</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {isEditingName ? (
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="rounded border border-emerald-500 bg-gray-900 px-2 py-0.5 text-xs text-white font-mono focus:outline-none"
                maxLength={14}
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="hidden sm:inline font-mono text-xs text-gray-300 hover:text-emerald-400"
                title="Click to rename your cartoon avatar"
              >
                🎮 {playerName} <span className="text-[10px] text-gray-500">(edit)</span>
              </button>
            )}

            <span className="rounded-md border border-emerald-900 bg-emerald-950/60 px-2 py-0.5 text-emerald-400">
              ● {onlineCount} Real Player{onlineCount > 1 ? 's' : ''} in Arena
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Game Layout: 3D Canvas (Left) + Live Chat & Scores (Right) */}
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12 overflow-y-auto">
          {/* 3D WebGL Sumo Viewport (8 Cols) */}
          <div className="flex flex-col items-center justify-center lg:col-span-8">
            <div className="relative w-full overflow-hidden rounded-2xl border border-gray-800 bg-black shadow-inner">
              <div
                ref={mountRef}
                className="h-[340px] sm:h-[400px] w-full block cursor-grab active:cursor-grabbing"
              />

              {/* In-Game Objective Toast */}
              <div className="absolute top-2.5 left-2.5 rounded-lg bg-black/80 px-3 py-1.5 font-mono text-[11px] text-gray-300 backdrop-blur-md border border-gray-800 space-y-0.5">
                <div>
                  <span className="text-emerald-400 font-bold">You (Your Avatar)</span> | Move: <span className="text-white font-bold">WASD / Arrows</span>
                </div>
                <div className="text-[10px] text-amber-400">
                  ⚡ Open a 2nd tab to test 1v1 | Bump opponent off the edge!
                </div>
              </div>
            </div>

            {/* Mobile Touch D-Pad Controls */}
            <div className="mt-3 flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => handleTouchMove('left')}
                className="h-10 w-10 rounded-lg bg-gray-800 text-white active:bg-emerald-600 font-bold"
              >
                ←
              </button>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleTouchMove('up')}
                  className="h-10 w-10 rounded-lg bg-gray-800 text-white active:bg-emerald-600 font-bold"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleTouchMove('down')}
                  className="h-10 w-10 rounded-lg bg-gray-800 text-white active:bg-emerald-600 font-bold"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleTouchMove('right')}
                className="h-10 w-10 rounded-lg bg-gray-800 text-white active:bg-emerald-600 font-bold"
              >
                →
              </button>
            </div>
          </div>

          {/* Live In-Game Chat & Scoreboard (4 Cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-gray-800 bg-[#111218] p-3.5 lg:col-span-4 h-[400px]">
            {/* Live Scoreboard */}
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-800">
                🏆 Sumo K.O. Leaderboard
              </div>
              <div className="mt-2 space-y-1 font-mono text-xs max-h-24 overflow-y-auto">
                {Object.entries(scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, sc], idx) => (
                    <div key={name} className="flex items-center justify-between text-gray-300">
                      <span className="truncate max-w-[130px]">
                        {idx === 0 ? '👑 ' : `${idx + 1}. `}
                        {name} {name === playerName ? '(You)' : ''}
                      </span>
                      <span className="font-bold text-emerald-400">{sc} KOs</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Live Room Chat Feed */}
            <div className="mt-3 flex-1 overflow-y-auto border-t border-gray-800 pt-2 font-mono text-[11px] space-y-1.5">
              <div className="font-bold text-gray-500 uppercase text-[10px]">Live Arena Chat:</div>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="leading-snug">
                  <span className="font-bold text-emerald-400">{msg.sender}: </span>
                  <span className="text-gray-300">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Quick Bisdak / Gaming Reaction Chips */}
            <div className="mt-2 flex flex-wrap gap-1 border-t border-gray-800 pt-2 font-mono text-[10px]">
              {['🤼‍♂️ BOING!', '☕ Kape Heavy!', 'Yawa nahagbong ko! 😂', 'GGs bai! 🚀'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickChat(chip)}
                  className="rounded border border-gray-700 bg-gray-800/80 px-2 py-0.5 text-gray-300 hover:text-white hover:border-emerald-500 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* In-Game Chat Input */}
            <form onSubmit={handleSendChat} className="mt-2 flex items-center gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say something in the 3D sumo arena..."
                className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1.5 font-mono text-xs text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                maxLength={45}
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-500 active:scale-95 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
