import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { sounds } from '../utils/audio'

// Shared Global Room Channel
const ROOM_CHANNEL = 'archie_cyber_sumo_bw_v1'
const ARENA_RADIUS = 11.5
const LOCAL_STORAGE_NAME_KEY = 'archie_cyber_sumo_player_name'
const LOCAL_STORAGE_COLOR_KEY = 'archie_cyber_sumo_player_color'

const CHARACTER_COLORS = [
  { id: 'green', name: 'Mint Green', hex: 0x22c55e, css: '#22c55e' },
  { id: 'cyan', name: 'Sky Cyan', hex: 0x38bdf8, css: '#38bdf8' },
  { id: 'purple', name: 'Soft Lavender', hex: 0xa855f7, css: '#a855f7' },
  { id: 'orange', name: 'Coral Orange', hex: 0xfb923c, css: '#fb923c' },
  { id: 'pink', name: 'Ruby Pink', hex: 0xf43f5e, css: '#f43f5e' },
  { id: 'yellow', name: 'Golden Amber', hex: 0xfacc15, css: '#facc15' },
]

export default function CyberArcadeModal({ isOpen, onClose }) {
  const mountRef = useRef(null)
  const chatBottomRef = useRef(null)
  const [playerId] = useState(() => 'usr_' + Math.floor(1000 + Math.random() * 9000))
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_NAME_KEY) || ''
    } catch {
      return ''
    }
  })
  const [colorIdx, setColorIdx] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_COLOR_KEY)
      const parsed = parseInt(saved, 10)
      return !isNaN(parsed) && parsed >= 0 && parsed < CHARACTER_COLORS.length ? parsed : 0
    } catch {
      return 0
    }
  })
  const [hasJoined, setHasJoined] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Cyber Sumo Arena Ready. Ram opponents off the ring!', time: '00:00' },
  ])
  const [scores, setScores] = useState({})
  const [onlineCount, setOnlineCount] = useState(1)

  const selectedColor = CHARACTER_COLORS[colorIdx] || CHARACTER_COLORS[0]

  // Local game state refs
  const gameRef = useRef({
    myPos: {
      x: (Math.random() - 0.5) * 4,
      y: 0,
      z: (Math.random() - 0.5) * 4,
      vx: 0,
      vz: 0,
      rotY: 0,
      score: 0,
      isFalling: false,
      isHeavy: false,
      lastBumperId: null,
      lastBumperName: null,
    },
    remotePlayers: {}, // { id: { name, x, y, z, vx, vz, rotY, score, colorHex, isFalling, lastSeen } }
    powerups: [
      { id: 1, type: 'coffee', x: -5, z: -4, active: true },
      { id: 2, type: 'nitro', x: 5, z: 4, active: true },
    ],
    keys: {},
    chatBubbles: {}, // { id: { text, timer } }
    channel: null,
    scene: null,
    camera: null,
    renderer: null,
    meshMap: {}, // id -> THREE.Group
    indicatorMesh: null,
    powerupMeshes: [],
  })

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Setup join state on modal open
  useEffect(() => {
    if (isOpen) {
      setHasJoined(false)
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_NAME_KEY)
        if (saved) {
          setPlayerName(saved)
        } else {
          setPlayerName(`Player_${Math.floor(100 + Math.random() * 900)}`)
        }
      } catch {
        setPlayerName(`Player_${Math.floor(100 + Math.random() * 900)}`)
      }
    }
  }, [isOpen])

  // 1. Networking (BroadcastChannel Real-Time Sync)
  useEffect(() => {
    if (!isOpen || !hasJoined) return

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
          } else if (type === 'BUMP_IMPULSE') {
            if (payload.targetId === playerId) {
              sounds.play('press')
              gameRef.current.myPos.vx += payload.impulseX
              gameRef.current.myPos.vz += payload.impulseZ
              gameRef.current.myPos.lastBumperId = payload.sourceId
              gameRef.current.myPos.lastBumperName = payload.sourceName
            }
          } else if (type === 'PLAYER_KNOCKED_OUT') {
            sounds.play('success')
            if (payload.killerId === playerId) {
              gameRef.current.myPos.score += 1
            }
            if (gameRef.current.remotePlayers[payload.killerId]) {
              gameRef.current.remotePlayers[payload.killerId].score =
                (gameRef.current.remotePlayers[payload.killerId].score || 0) + 1
            }

            const alertText = `${payload.victimName} was knocked off by ${payload.killerName}!`
            setChatMessages((prev) => [
              ...prev.slice(-25),
              { sender: 'System', text: alertText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ])
          } else if (type === 'CHAT_MESSAGE') {
            sounds.play('tick')
            setChatMessages((prev) => [...prev.slice(-25), payload])
            gameRef.current.chatBubbles[payload.id] = {
              text: payload.text,
              timer: Date.now() + 4500,
            }
          }
        }
      }
    } catch {}

    // Periodic Heartbeat
    const hbInterval = setInterval(() => {
      if (bc) {
        bc.postMessage({
          type: 'PLAYER_STATE',
          payload: {
            id: playerId,
            name: playerName,
            colorHex: selectedColor.hex,
            x: gameRef.current.myPos.x,
            y: gameRef.current.myPos.y,
            z: gameRef.current.myPos.z,
            vx: gameRef.current.myPos.vx,
            vz: gameRef.current.myPos.vz,
            rotY: gameRef.current.myPos.rotY,
            score: gameRef.current.myPos.score,
          },
        })
      }

      // Cleanup disconnected players
      const now = Date.now()
      const remotes = gameRef.current.remotePlayers
      const scene = gameRef.current.scene
      const meshMap = gameRef.current.meshMap

      let count = 1
      Object.keys(remotes).forEach((k) => {
        if (now - remotes[k].lastSeen > 4000) {
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
  }, [isOpen, hasJoined, playerId, playerName, selectedColor])

  // 2. Keyboard Handlers
  useEffect(() => {
    if (!isOpen || !hasJoined) return

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
  }, [isOpen, hasJoined])

  // 3. Three.js Minimalist Black & White Scene & Physics Loop
  useEffect(() => {
    if (!isOpen || !hasJoined || !mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth || 600
    const height = container.clientHeight || 400

    // Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0c)
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.02)
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4)
    dirLight.position.set(12, 24, 12)
    dirLight.castShadow = true
    scene.add(dirLight)

    // Floating Circular Sumo Platform (Matte Black with Crisp White Perimeter Ring)
    const islandGeo = new THREE.CylinderGeometry(ARENA_RADIUS, ARENA_RADIUS + 0.5, 1.4, 64)
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.85,
      metalness: 0.1,
    })
    const island = new THREE.Mesh(islandGeo, islandMat)
    island.position.y = -0.7
    island.receiveShadow = true
    scene.add(island)

    // Crisp White Ring Boundary
    const ringGeo = new THREE.RingGeometry(ARENA_RADIUS - 0.18, ARENA_RADIUS, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    scene.add(ring)

    // Center marker ring
    const centerGeo = new THREE.RingGeometry(1.8, 1.9, 32)
    const centerMat = new THREE.MeshBasicMaterial({ color: 0x333338, side: THREE.DoubleSide })
    const centerRing = new THREE.Mesh(centerGeo, centerMat)
    centerRing.rotation.x = -Math.PI / 2
    centerRing.position.y = 0.02
    scene.add(centerRing)

    // Helper: Build Minimalist Colored Cartoon Character
    const createCartoonCharacter = (colorHex, isLocal) => {
      const group = new THREE.Group()

      // Cute Rounded Chibi Body
      const bodyGeo = new THREE.SphereGeometry(0.85, 24, 24)
      bodyGeo.scale(1, 1.15, 1)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.25,
        metalness: 0.1,
      })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.y = 0.9
      body.castShadow = true
      group.add(body)

      // Expressive Cartoon Left Eye
      const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16)
      eyeGeo.scale(1, 1.3, 0.6)
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat)
      eyeL.position.set(-0.3, 1.1, 0.75)
      group.add(eyeL)

      // Pupil Left
      const pupilGeo = new THREE.SphereGeometry(0.09, 8, 8)
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 })
      const pupilL = new THREE.Mesh(pupilGeo, pupilMat)
      pupilL.position.set(-0.3, 1.1, 0.88)
      group.add(pupilL)

      // Expressive Cartoon Right Eye
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat)
      eyeR.position.set(0.3, 1.1, 0.75)
      group.add(eyeR)

      // Pupil Right
      const pupilR = new THREE.Mesh(pupilGeo, pupilMat)
      pupilR.position.set(0.3, 1.1, 0.88)
      group.add(pupilR)

      // Overhead "YOU" Identification Arrow Pointer (Local Player Only)
      if (isLocal) {
        const arrowGeo = new THREE.ConeGeometry(0.22, 0.45, 8)
        arrowGeo.rotateX(Math.PI)
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const arrow = new THREE.Mesh(arrowGeo, arrowMat)
        arrow.position.y = 2.4
        group.add(arrow)
        gameRef.current.indicatorMesh = arrow
      }

      return group
    }

    // Local Player Mesh with chosen color
    const localMesh = createCartoonCharacter(selectedColor.hex, true)
    scene.add(localMesh)
    gameRef.current.meshMap[playerId] = localMesh

    // 3D Colored Power-ups (Coffee Mug & Nitro Crystal)
    const pMeshes = []
    gameRef.current.powerups.forEach((pu) => {
      const geo = pu.type === 'coffee'
        ? new THREE.CylinderGeometry(0.38, 0.3, 0.6, 16)
        : new THREE.OctahedronGeometry(0.42)

      const mat = new THREE.MeshStandardMaterial({
        color: pu.type === 'coffee' ? 0xf59e0b : 0x38bdf8,
        emissive: pu.type === 'coffee' ? 0xb45309 : 0x0284c7,
        emissiveIntensity: 0.55,
        roughness: 0.25,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(pu.x, 0.6, pu.z)
      scene.add(mesh)
      pMeshes.push({ mesh, data: pu })
    })
    gameRef.current.powerupMeshes = pMeshes

    // Resize
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // ── 60FPS Game Physics Loop ──
    let reqId
    const loop = () => {
      const { myPos, keys, remotePlayers, channel, meshMap, indicatorMesh } = gameRef.current

      // 1. Local Player Acceleration & Friction
      const accel = myPos.isHeavy ? 0.018 : 0.024
      const maxSpeed = myPos.isHeavy ? 0.18 : 0.22

      if (!myPos.isFalling) {
        if (keys['w'] || keys['arrowup'] || keys['KeyW']) myPos.vz -= accel
        if (keys['s'] || keys['arrowdown'] || keys['KeyS']) myPos.vz += accel
        if (keys['a'] || keys['arrowleft'] || keys['KeyA']) myPos.vx -= accel
        if (keys['d'] || keys['arrowright'] || keys['KeyD']) myPos.vx += accel

        const speed = Math.hypot(myPos.vx, myPos.vz)
        if (speed > maxSpeed) {
          myPos.vx = (myPos.vx / speed) * maxSpeed
          myPos.vz = (myPos.vz / speed) * maxSpeed
        }

        myPos.vx *= 0.94
        myPos.vz *= 0.94
        myPos.x += myPos.vx
        myPos.z += myPos.vz

        if (Math.hypot(myPos.vx, myPos.vz) > 0.01) {
          myPos.rotY = Math.atan2(myPos.vx, myPos.vz)
        }

        // Falling off edge
        const dist = Math.hypot(myPos.x, myPos.z)
        if (dist > ARENA_RADIUS) {
          myPos.isFalling = true
          sounds.play('droplet')

          if (channel) {
            // Record KO to the killer
            if (myPos.lastBumperId) {
              channel.postMessage({
                type: 'PLAYER_KNOCKED_OUT',
                payload: {
                  victimId: playerId,
                  victimName: playerName,
                  killerId: myPos.lastBumperId,
                  killerName: myPos.lastBumperName || 'Opponent',
                },
              })
            }
          }
        }
      } else {
        // Fall down into void
        myPos.y -= 0.35
        myPos.rotY += 0.15

        if (myPos.y < -16) {
          myPos.x = (Math.random() - 0.5) * 4
          myPos.z = (Math.random() - 0.5) * 4
          myPos.y = 0
          myPos.vx = 0
          myPos.vz = 0
          myPos.isFalling = false
          myPos.lastBumperId = null
          myPos.lastBumperName = null
        }
      }

      // Update Local Mesh & Floating Indicator
      if (localMesh) {
        localMesh.position.set(myPos.x, myPos.y, myPos.z)
        localMesh.rotation.y = myPos.rotY

        const moveMag = Math.hypot(myPos.vx, myPos.vz)
        const bounce = 1 + Math.sin(Date.now() * 0.015) * moveMag * 2
        localMesh.scale.set(myPos.isHeavy ? 1.35 : 1, myPos.isHeavy ? 1.35 : bounce, myPos.isHeavy ? 1.35 : 1)
      }

      if (indicatorMesh) {
        indicatorMesh.position.y = 2.4 + Math.sin(Date.now() * 0.006) * 0.15
      }

      // Broadcast Local State
      if (channel) {
        channel.postMessage({
          type: 'PLAYER_STATE',
          payload: {
            id: playerId,
            name: playerName,
            colorHex: selectedColor.hex,
            x: myPos.x,
            y: myPos.y,
            z: myPos.z,
            vx: myPos.vx,
            vz: myPos.vz,
            rotY: myPos.rotY,
            score: myPos.score,
            isFalling: myPos.isFalling,
          },
        })
      }

      // 2. Render Remote Players with their chosen colors
      Object.values(remotePlayers).forEach((other) => {
        if (!meshMap[other.id]) {
          const rMesh = createCartoonCharacter(other.colorHex || 0x38bdf8, false)
          scene.add(rMesh)
          meshMap[other.id] = rMesh
        }

        const rMesh = meshMap[other.id]
        if (rMesh) {
          rMesh.position.lerp(new THREE.Vector3(other.x, other.y || 0, other.z), 0.35)
          rMesh.rotation.y = other.rotY || 0
        }
      })

      // 3. Elastic Collisions (Ramming Real Players)
      Object.values(remotePlayers).forEach((other) => {
        if (myPos.isFalling || other.isFalling) return
        const dist = Math.hypot(myPos.x - other.x, myPos.z - other.z)
        const hitRadius = myPos.isHeavy ? 1.6 : 1.3

        if (dist < hitRadius) {
          sounds.play('press')
          const dx = (myPos.x - other.x) / (dist || 1)
          const dz = (myPos.z - other.z) / (dist || 1)
          const force = myPos.isHeavy ? 0.44 : 0.25

          myPos.vx += dx * (force * 0.7)
          myPos.vz += dz * (force * 0.7)

          if (channel) {
            channel.postMessage({
              type: 'BUMP_IMPULSE',
              payload: {
                targetId: other.id,
                sourceId: playerId,
                sourceName: playerName,
                impulseX: -dx * force,
                impulseZ: -dz * force,
              },
            })
          }
        }
      })

      // 4. Power-up Pickups
      const now = Date.now()
      pMeshes.forEach(({ mesh, data }) => {
        mesh.rotation.y += 0.04
        mesh.position.y = 0.6 + Math.sin(now * 0.004 + data.id) * 0.15

        const dist = Math.hypot(myPos.x - data.x, myPos.z - data.z)
        if (dist < 1.3 && data.active && !myPos.isFalling) {
          sounds.play('success')
          data.active = false
          mesh.visible = false

          if (data.type === 'coffee') {
            myPos.isHeavy = true
            setTimeout(() => (myPos.isHeavy = false), 6000)
          } else if (data.type === 'nitro') {
            myPos.vx *= 2.4
            myPos.vz *= 2.4
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

      // Live Scoreboard
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
  }, [isOpen, hasJoined, playerId, playerName, selectedColor])

  // In-Game Chat Send
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

    setChatMessages((prev) => [...prev.slice(-25), msgObj])
    gameRef.current.chatBubbles[playerId] = {
      text: trimmed,
      timer: Date.now() + 4500,
    }

    if (gameRef.current.channel) {
      gameRef.current.channel.postMessage({
        type: 'CHAT_MESSAGE',
        payload: msgObj,
      })
    }

    setChatInput('')
  }

  const handleQuickChat = (text) => {
    setChatInput(text)
    setTimeout(() => handleSendChat(), 30)
  }

  const handleTouchMove = (direction) => {
    const { myPos } = gameRef.current
    const step = 0.18
    if (direction === 'up') myPos.vz -= step
    if (direction === 'down') myPos.vz += step
    if (direction === 'left') myPos.vx -= step
    if (direction === 'right') myPos.vx += step
  }

  const handleJoinArena = (e) => {
    e?.preventDefault()
    const name = playerName.trim() || `Player_${Math.floor(100 + Math.random() * 900)}`
    setPlayerName(name)
    try {
      localStorage.setItem(LOCAL_STORAGE_NAME_KEY, name)
      localStorage.setItem(LOCAL_STORAGE_COLOR_KEY, String(colorIdx))
    } catch {}
    setHasJoined(true)
    sounds.play('chime')

    // Broadcast join announcement
    if (gameRef.current.channel) {
      gameRef.current.channel.postMessage({
        type: 'CHAT_MESSAGE',
        payload: {
          id: playerId,
          sender: 'System',
          text: `${name} entered the arena.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      })
    }
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
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* ── Name & Character Color Selection Modal ── */}
      {!hasJoined ? (
        <div className="relative z-20 w-full max-w-md rounded-3xl border border-gray-800 bg-[#0c0d12] p-6 text-white shadow-2xl">
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-gray-400">
              Multiplayer Arena
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              CYBER SUMO 3D
            </h2>
            <p className="mt-2 text-xs text-gray-400">
              Pick your callsign and avatar color. Saved permanently on this device.
            </p>
          </div>

          <form onSubmit={handleJoinArena} className="mt-6 space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1.5">
                Callsign / Name:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your callsign..."
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 font-mono text-sm text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                maxLength={15}
                autoFocus
              />
            </div>

            {/* Avatar Color Picker */}
            <div>
              <label className="block font-mono text-xs text-gray-400 mb-2">
                Choose Avatar Color:
              </label>
              <div className="flex items-center justify-center gap-3">
                {CHARACTER_COLORS.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sounds.play('tick')
                      setColorIdx(idx)
                    }}
                    style={{ backgroundColor: c.css }}
                    className={`h-8 w-8 rounded-full transition-transform cursor-pointer ${
                      colorIdx === idx
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="mt-1.5 text-center font-mono text-[11px] text-gray-400">
                Selected: <span style={{ color: selectedColor.css }} className="font-bold">{selectedColor.name}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-white py-3 font-mono text-sm font-bold text-black transition-all hover:bg-gray-200 active:scale-95 cursor-pointer mt-2"
            >
              Enter Arena →
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs text-gray-500 hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── Main Minimalist Black & White Frame with Colored Characters ── */
        <div className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-gray-800 bg-[#0c0d12] shadow-2xl text-gray-200">
          {/* Top Header Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-gray-800 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#101116] gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                style={{ backgroundColor: selectedColor.css }}
                className="h-2.5 w-2.5 rounded-full animate-pulse shadow-sm"
              />
              <span className="font-mono text-xs sm:text-sm font-bold tracking-tight text-white">
                CYBER SUMO <span className="text-gray-400 font-normal text-[10px] sm:text-xs">[3D Multiplayer]</span>
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5 text-gray-300 truncate max-w-[120px] sm:max-w-[160px]">
                <span style={{ backgroundColor: selectedColor.css }} className="inline-block h-2 w-2 rounded-full" />
                {playerName}
              </span>
              <span className="text-gray-600">|</span>
              <span className="rounded-md border border-gray-800 bg-gray-900 px-1.5 py-0.5 text-gray-300 text-[10px] sm:text-xs">
                ● {onlineCount} In Arena
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer text-xs"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Game Layout: 3D Canvas (Left) + Live Chat & Scores (Right) */}
          <div className="grid grid-cols-1 gap-4 p-3 sm:p-4 lg:grid-cols-12 overflow-y-auto">
            {/* 3D WebGL Sumo Viewport */}
            <div className="flex flex-col items-center justify-center lg:col-span-8">
              <div className="relative w-full overflow-hidden rounded-2xl border border-gray-800 bg-black shadow-inner">
                <div
                  ref={mountRef}
                  className="h-[250px] sm:h-[380px] w-full block cursor-grab active:cursor-grabbing"
                />

                {/* In-Game Objective Toast */}
                <div className="absolute top-2 left-2 rounded-lg bg-black/80 px-2.5 py-1 sm:px-3 sm:py-1.5 font-mono text-[10px] sm:text-[11px] text-gray-300 backdrop-blur-md border border-gray-800 space-y-0.5">
                  <div>
                    <span style={{ color: selectedColor.css }} className="font-bold">
                      You ({selectedColor.name} ▼)
                    </span>{' '}
                    | Move: <span className="text-white font-bold">WASD / Arrows</span>
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-gray-400">
                    Bump opponents off the platform into the void
                  </div>
                </div>
              </div>

              {/* Mobile Touch D-Pad */}
              <div className="mt-3 flex items-center justify-center gap-3 sm:hidden select-none">
                <button
                  type="button"
                  onClick={() => handleTouchMove('left')}
                  className="h-11 w-11 rounded-xl bg-gray-800 text-white active:bg-gray-600 font-bold text-lg shadow-md touch-manipulation"
                >
                  ←
                </button>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleTouchMove('up')}
                    className="h-11 w-11 rounded-xl bg-gray-800 text-white active:bg-gray-600 font-bold text-lg shadow-md touch-manipulation"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTouchMove('down')}
                    className="h-11 w-11 rounded-xl bg-gray-800 text-white active:bg-gray-600 font-bold text-lg shadow-md touch-manipulation"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleTouchMove('right')}
                  className="h-11 w-11 rounded-xl bg-gray-800 text-white active:bg-gray-600 font-bold text-lg shadow-md touch-manipulation"
                >
                  →
                </button>
              </div>
            </div>

            {/* Live In-Game Chat & Scoreboard */}
            <div className="flex flex-col justify-between rounded-2xl border border-gray-800 bg-[#111218] p-3 sm:p-3.5 lg:col-span-4 h-auto min-h-[300px] lg:h-[380px]">
              {/* Live Scoreboard */}
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-800">
                  Leaderboard
                </div>
                <div className="mt-2 space-y-1 font-mono text-xs max-h-24 overflow-y-auto">
                  {Object.entries(scores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, sc], idx) => (
                      <div key={name} className="flex items-center justify-between text-gray-300">
                        <span className="truncate max-w-[130px]">
                          {`${idx + 1}. `}
                          {name} {name === playerName ? '(You)' : ''}
                        </span>
                        <span className="font-bold text-white">{sc} KOs</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Live Room Chat Feed */}
              <div className="mt-3 flex-1 overflow-y-auto border-t border-gray-800 pt-2 font-mono text-[11px] space-y-1.5 max-h-[160px]">
                <div className="font-bold text-gray-500 uppercase text-[10px]">Arena Chat:</div>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="leading-snug">
                    <span className={`font-bold ${msg.sender === 'System' ? 'text-gray-400 italic' : 'text-white'}`}>
                      {msg.sender}:{' '}
                    </span>
                    <span className="text-gray-300">{msg.text}</span>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Monochrome Reaction Chips (Zero Emojis) */}
              <div className="mt-2 flex flex-wrap gap-1 border-t border-gray-800 pt-2 font-mono text-[10px]">
                {['BOING!', 'Coffee Boost', 'Yawa nahagbong ko!', 'GGs!'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleQuickChat(chip)}
                    className="rounded border border-gray-700 bg-gray-900 px-2 py-0.5 text-gray-300 hover:text-white hover:border-gray-500 cursor-pointer"
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
                  placeholder="Type a message to all visitors..."
                  className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1.5 font-mono text-xs text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
                  maxLength={45}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-white px-3 py-1.5 font-mono text-xs font-semibold text-black hover:bg-gray-200 active:scale-95 cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
